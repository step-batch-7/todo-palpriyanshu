const {readFileSync} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');
const config = require('../config.js');

const {read, getAbsUrl, isFileExist, save} = require('./fileManager.js');
const TodoList = require('./todoList');

const todoList = TodoList.load(read(config.DATA_STORE));

const successFulResponse = function(req, res, content) {
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
  return successFulResponse(req, res, content);
};

const saveTitle = function(req, res) {
  const {title} = req.body;
  const titleId = `T_${new Date().getTime()}`;
  todoList.add({title, titleId, tasks: []});
  save(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(titleId));
};

const saveTask = function(req, res) {
  const allTodos = todoList.find(req.body.titleId);
  const taskId = `T_${new Date().getTime()}`;
  const {task} = req.body;
  todoList.update(allTodos, {task, taskId, done: false});
  save(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(taskId));
};

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const loadTask = function(req, res) {
  const allTodos = todoList.find(req.body.titleId);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const filterTodo = function(req, res) {
  const allTodos = todoList.filter(req.body.searchValue);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const deleteAllTodo = function(req, res) {
  const allTodos = todoList.find(req.body.titleId);
  todoList.delete(allTodos);
  save(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const deleteTask = function(req, res) {
  todoList.deleteTask(req.body.titleId, req.body.taskId);
  save(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const updateTaskStatus = function(req, res) {
  todoList.updateTask(req.body.titleId, req.body.taskId);
  save(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const serveTodoPage = function(req, res) {
  let todoPage = read('template/todoPage.html');
  const html = todoList.toHtml();
  todoPage = todoPage.replace(/__Project__/, html.join(''));
  return successFulResponse(req, res, todoPage);
};

const notFound = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'File Not Allowed');
  res.end();
};

const methodNotAllowed = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'Method Not Allowed');
  res.end();
};

const formatTodoDetails = function(req, res, next) {
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
  formatTodoDetails,
  saveTitle,
  saveTask,
  loadTask,
  filterTodo,
  updateTaskStatus,
  deleteAllTodo,
  deleteTask,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
};
