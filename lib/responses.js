const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');

const TodoList = require('./todoList.js');
const FileManager = require('./fileManager.js');

const STATIC_FOLDER = `${__dirname}/..`;
const previousTasks = readFileSync(
  `${STATIC_FOLDER}/dataStore/todoNotes.json`,
  'utf8'
);

const todoStore = FileManager.initialize();
const todoList = TodoList.load(previousTasks);
const savePost = post => {
  writeFile(
    `${STATIC_FOLDER}/dataStore/todoNotes.json`,
    JSON.stringify(post, null, 2),
    () => {}
  );
};

const successFulResponse = function(req, res, content) {
  const extension = req.url.split('.').pop();
  const contentType = CONTENT_TYPE[extension];
  res.setHeader('content-type', contentType);
  res.end(content);
};

const getAbsUrl = function(req) {
  let absPath = `${STATIC_FOLDER}/public${req.url}`;
  if (req.url === '/') {
    req.url = '/index.html';
    absPath = `${STATIC_FOLDER}/public${req.url}`;
  }

  if (req.url === '/lib/todoPage.js') {
    absPath = `${STATIC_FOLDER}/${req.url}`;
  }
  return absPath;
};

const serveStaticFiles = function(req, res, next) {
  const absPath = getAbsUrl(req);
  const stat = existsSync(absPath) && statSync(absPath).isFile();
  if (!stat) {
    return next();
  }
  const content = readFileSync(absPath);
  return successFulResponse(req, res, content);
};

const saveTitle = function(req, res) {
  const {title} = req.body;
  const titleId = `T_${new Date().getTime()}`;
  todoStore.add({title, titleId, tasks: []});
  todoStore.save();
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(titleId));
};

const saveTask = function(req, res) {
  const allTodos = todoList.find(req.body.titleId);
  const taskId = `T_${new Date().getMilliseconds()}`;
  const {task} = req.body;
  todoList.update(allTodos, {task, taskId});
  savePost(todoList.lists);
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

const deleteAllTodo = function(req, res) {
  const allTodos = todoList.find(req.body.titleId);
  todoList.delete(allTodos);
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const deleteTask = function(req, res) {
  todoList.deleteTask(req.body.titleId, req.body.taskId);
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const updateTaskStatus = function(req, res) {
  todoList.updateTask(req.body.titleId, req.body.taskId);
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const renderTodoPage = function(todoList) {
  let todoPage = readFileSync(
    `${STATIC_FOLDER}/template/todoPage.html`,
    'utf8'
  );
  const html = todoList.toHtml();
  todoPage = todoPage.replace(/__Project__/, html.join(''));
  return todoPage;
};

const serveTodoPage = function(req, res) {
  const content = renderTodoPage(todoList);
  return successFulResponse(req, res, content);
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
