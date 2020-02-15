const {readFileSync} = require('fs');
const STATUS_CODES = require('./statusCodes.js');
const config = require('../config.js');

const {
  getAbsUrl,
  isFileExist,
  readFile,
  saveUserTodos
} = require('./fileManager.js');

const {UserManager} = require('./userManager');
const userManager = UserManager.initializeUsers(readFile(config.DATA_STORE));

const {SessionManager} = require('./sessionManager');
const sessionManager = new SessionManager();

const isUserLoggedIn = function(req, res, next) {
  const username = sessionManager.getUsername(req.cookies.sessionId);
  if (username) {
    req.body.username = username;
    return next();
  }
  res.redirect('/login.html');
};

const serveStaticFiles = function(req, res, next) {
  const absPath = getAbsUrl(req);
  if (!isFileExist(absPath)) {
    return next();
  }
  const content = readFileSync(absPath);
  res.send(content);
};

const saveTodo = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const {title} = req.body;
  const id = `T_${new Date().getTime()}`;
  user.add({title, id, tasks: []});
  saveUserTodos(userManager.users);
  res.json({title, id});
};

const deleteTodo = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const todo = user.find(req.body.todoId);
  user.delete(todo);
  saveUserTodos(userManager.users);
  res.send();
};

const saveTask = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const id = `T_${new Date().getTime()}`;
  const {name} = req.body;
  user.addTask(req.body.todoId, {name, id, done: false});
  saveUserTodos(userManager.users);
  res.json({name, id, done: false});
};

const deleteTask = function(req, res) {
  const user = userManager.getUser(req.body.username);
  user.deleteTask(req.body.todoId, req.body.taskId);
  saveUserTodos(userManager.users);
  res.send();
};

const updateTaskStatus = function(req, res) {
  const user = userManager.getUser(req.body.username);
  user.updateTask(req.body.titleId, req.body.taskId);
  saveUserTodos(userManager.users);
  res.send();
};

const loadTask = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const todo = user.find(req.body.todoId);
  res.json([todo]);
};

const editTitle = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const {todoId, title} = req.body;
  user.editTitle(todoId, title);
  saveUserTodos(userManager.users);
  res.json(title);
};

const editTask = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const {todoId, taskId, name} = req.body;
  user.editTask(todoId, taskId, name);
  saveUserTodos(userManager.users);
  res.json(name);
};

const filterTodo = function(req, res) {
  const user = userManager.getUser(req.body.username);
  const allTodos = user.filterTodos(req.body.searchValue);
  res.json(allTodos);
};

const serveTodoPage = function(req, res) {
  const user = userManager.getUser(req.body.username);
  if (user) {
    const html = user.toHtml();
    let todoPage = readFile('template/todoPage.html');
    todoPage = todoPage.replace(/__Project__/, html.join(''));
    res.send(todoPage);
    return;
  }
  res.redirect('/login.html');
};

const loginUser = function(req, res) {
  const {username, password} = req.body;
  const matchedUser = userManager.matchUser(username, password);
  if (matchedUser) {
    const sessionId = sessionManager.createSession(username);
    res.cookie('sessionId', sessionId);
    res.redirect('/todo');
    return;
  }
  res.redirect('/login.html');
};

const signInUser = function(req, res) {
  const {name, username, password} = req.body;
  const user = userManager.getUser(username);
  if (!user) {
    userManager.addNewUser(name, username, password);
    saveUserTodos(userManager.users);
    res.redirect('/login.html');
    return;
  }
  res.redirect('/signIn.html');
};

const notFound = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'File Not Allowed');
  res.end();
};

const methodNotAllowed = function(req, res) {
  res.writeHead(STATUS_CODES.notFound, 'Method Not Allowed');
  res.end();
};

module.exports = {
  isUserLoggedIn,
  serveTodoPage,
  loginUser,
  signInUser,
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
  methodNotAllowed,
  sessionManager
};
