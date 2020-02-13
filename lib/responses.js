const {readFileSync} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');
const config = require('../config.js');

const {
  getAbsUrl,
  isFileExist,
  readFile,
  getUserTodos,
  saveUserTodos,
  getUsersInfo
} = require('./fileManager.js');

const {TodoLists} = require('./todoList');
const {Sessions} = require('./sessions');
const sessions = new Sessions();

const successfulResponse = function(req, res, content) {
  const extension = req.url.split('.').pop();
  const contentType = CONTENT_TYPE[extension];
  res.setHeader('content-type', contentType);
  res.end(content);
};

const serveStaticFiles = function(req, res, next) {
  if (req.url == '/') {
    res.statusCode = STATUS_CODES.redirect;
    res.setHeader('location', '/template/todoPage.html');
    res.end();
    return;
  }
  const absPath = getAbsUrl(req);
  if (!isFileExist(absPath)) {
    return next();
  }
  const content = readFileSync(absPath);
  return successfulResponse(req, res, content);
};

const saveTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {title} = req.body;
  const id = `T_${new Date().getTime()}`;
  todoLists.add({title, id, tasks: []});
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify({title, id}));
};

const deleteTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const todo = todoLists.find(req.body.todoId);
  todoLists.delete(todo);
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const saveTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const id = `T_${new Date().getTime()}`;
  const {name} = req.body;
  todoLists.addTask(req.body.todoId, {name, id, done: false});
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify({name, id, done: false}));
};

const deleteTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  todoLists.deleteTask(req.body.todoId, req.body.taskId);
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const updateTaskStatus = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  todoLists.updateTask(req.body.titleId, req.body.taskId);
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.ok;
  res.end();
};

const loadTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const todo = todoLists.find(req.body.todoId);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify([todo]));
};

const editTitle = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {todoId, title} = req.body;
  todoLists.editTitle(todoId, title);
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(title));
};

const editTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {todoId, taskId, name} = req.body;
  todoLists.editTask(todoId, taskId, name);
  saveUserTodos(todoLists.lists);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(name));
};

const filterTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const allTodos = todoLists.filterTodos(req.body.searchValue);
  res.statusCode = STATUS_CODES.create;
  res.end(JSON.stringify(allTodos));
};

const serveTodoPage = function(req, res) {
  const username = sessions.getUsername(req.headers.cookie);
  if (username) {
    const userTodos = getUserTodos();
    const todoLists = TodoLists.load(userTodos);
    let todoPage = readFile('template/todoPage.html');
    const html = todoLists.toHtml();
    todoPage = todoPage.replace(/__Project__/, html.join(''));
    return successfulResponse(req, res, todoPage);
  }
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/login.html');
  res.end();
};

const serveLoginPage = function(req, res) {
  const url = getAbsUrl(req);
  const content = readFile(url);
  return successfulResponse(req, res, content);
};

const getMatchedUser = (usersInfo, username, password) => {
  const matchedUser = usersInfo.find(
    user => user.username == username && user.password == password
  );
  return matchedUser && matchedUser.username;
};

const loginUser = function(req, res) {
  const usersInfo = getUsersInfo();
  const {username, password} = req.body;
  const matchedUserName = getMatchedUser(usersInfo, username, password);
  if (matchedUserName) {
    const sessionId = sessions.createSession(username);
    res.statusCode = STATUS_CODES.redirect;
    res.setHeader('Set-Cookie', sessionId);
    res.setHeader('location', '/template/todoPage.html');
    res.end();
    return;
  }
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/login.html');
  res.end();
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
  if (req.headers['content-type'] === CONTENT_TYPE.json) {
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
  serveLoginPage,
  loginUser,
  serveStaticFiles,
  saveTodo,
  deleteTodo,
  saveTask,
  deleteTask,
  updateTaskStatus,
  loadTask,
  editTitle,
  editTask,
  filterTodo,
  notFound,
  methodNotAllowed
};
