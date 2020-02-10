const {readFileSync} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');
const config = require('../config.js');

const {readFile, getAbsUrl, isFileExist, save} = require('./fileManager.js');
const TodoLists = require('./todoList');

const todoLists = TodoLists.load(readFile(config.DATA_STORE));

const successfulResponse = function(req, res, content) {
  const extension = req.url.split('.').pop();
  const contentType = CONTENT_TYPE[extension];
  res.setHeader('content-type', contentType);
  res.end(content);
};

const serveStaticFiles = function(req, res, next) {
  const absPath = getAbsUrl(req);
  if (!isFileExist(absPath)) {
    return next();
  }
  const content = readFileSync(absPath);
  return successfulResponse(req, res, content);
};

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const saveTodo = function(req, res) {
  const {title} = req.body;
  const titleId = `T_${new Date().getTime()}`;
  todoLists.add({title, titleId, tasks: []});
  save(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(titleId));
};

const deleteTodo = function(req, res) {
  const allTodos = todoLists.find(req.body.titleId);
  todoLists.delete(allTodos);
  save(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const saveTask = function(req, res) {
  const taskId = `T_${new Date().getTime()}`;
  const {task} = req.body;
  todoLists.addTask(req.body.titleId, {task, taskId, done: false});
  save(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(taskId));
};

const deleteTask = function(req, res) {
  todoLists.deleteTask(req.body.titleId, req.body.taskId);
  save(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const updateTaskStatus = function(req, res) {
  todoLists.updateTask(req.body.titleId, req.body.taskId);
  save(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const loadTask = function(req, res) {
  const allTodos = todoLists.find(req.body.titleId);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const filterTodo = function(req, res) {
  const allTodos = todoLists.filter(req.body.searchValue);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const serveTodoPage = function(req, res) {
  let todoPage = readFile('template/todoPage.html');
  const html = todoLists.toHtml();
  todoPage = todoPage.replace(/__Project__/, html.join(''));
  return successfulResponse(req, res, todoPage);
};

const notFound = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'File Not Allowed');
  res.end();
};

const methodNotAllowed = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'Method Not Allowed');
  res.end();
};

const parseBody = function(req, res, next) {
  if (req.headers['content-type'] === 'application/json') {
    req.body = JSON.parse(req.body);
  }
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    req.body = querystring.parse(req.body);
  }
  next();
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

module.exports = {
  readBody,
  parseBody,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  saveTodo,
  deleteTodo,
  saveTask,
  deleteTask,
  updateTaskStatus,
  loadTask,
  filterTodo,
  notFound,
  methodNotAllowed
};
