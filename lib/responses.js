const {readFileSync} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');

const {TodoStore, read, getAbsUrl, isFileExist} = require('./fileManager.js');

const todoStore = TodoStore.initialize();

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
  todoStore.add({title, titleId, tasks: []});
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(titleId));
};

const saveTask = function(req, res) {
  const allTodos = todoStore.find(req.body.titleId);
  const taskId = `T_${new Date().getMilliseconds()}`;
  const {task} = req.body;
  todoStore.update(allTodos, {task, taskId});
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(taskId));
};

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const loadTask = function(req, res) {
  const allTodos = todoStore.find(req.body.titleId);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const deleteAllTodo = function(req, res) {
  todoStore.delete(req.body.titleId);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const deleteTask = function(req, res) {
  todoStore.deleteTask(req.body.titleId, req.body.taskId);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const updateTaskStatus = function(req, res) {
  todoStore.updateTask(req.body.titleId, req.body.taskId);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const serveTodoPage = function(req, res) {
  let todoPage = read('template/todoPage.html');
  const html = todoStore.toHtml();
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
  } else {
    req.body = querystring.parse(req.body);
  }
  if (req.body.tasks) {
    req.body.tasks = JSON.parse(req.body.tasks) || [];
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
  updateTaskStatus,
  deleteAllTodo,
  deleteTask,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
};
