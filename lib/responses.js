const {readFileSync} = require('fs');
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

const serveStaticFiles = function(req, res, next) {
  const absPath = getAbsUrl(req);
  if (!isFileExist(absPath)) {
    return next();
  }
  const content = readFileSync(absPath);
  res.send(content);
};

const saveTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {title} = req.body;
  const id = `T_${new Date().getTime()}`;
  todoLists.add({title, id, tasks: []});
  saveUserTodos(todoLists.lists);
  res.json({title, id});
};

const deleteTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const todo = todoLists.find(req.body.todoId);
  todoLists.delete(todo);
  saveUserTodos(todoLists.lists);
  res.send();
};

const saveTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const id = `T_${new Date().getTime()}`;
  const {name} = req.body;
  todoLists.addTask(req.body.todoId, {name, id, done: false});
  saveUserTodos(todoLists.lists);
  res.json({name, id, done: false});
};

const deleteTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  todoLists.deleteTask(req.body.todoId, req.body.taskId);
  saveUserTodos(todoLists.lists);
  res.send();
};

const updateTaskStatus = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  todoLists.updateTask(req.body.titleId, req.body.taskId);
  saveUserTodos(todoLists.lists);
  res.send();
};

const loadTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const todo = todoLists.find(req.body.todoId);
  res.json([todo]);
};

const editTitle = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {todoId, title} = req.body;
  todoLists.editTitle(todoId, title);
  saveUserTodos(todoLists.lists);
  res.json(title);
};

const editTask = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const {todoId, taskId, name} = req.body;
  todoLists.editTask(todoId, taskId, name);
  saveUserTodos(todoLists.lists);
  res.json(name);
};

const filterTodo = function(req, res) {
  const todoLists = TodoLists.load(readFile(config.DATA_STORE));
  const allTodos = todoLists.filterTodos(req.body.searchValue);
  res.json(allTodos);
};

const serveTodoPage = function(req, res) {
  const username = sessions.getUsername(req.cookies.sessionId);
  if (username) {
    const userTodos = getUserTodos();
    const todoLists = TodoLists.load(userTodos);
    let todoPage = readFile('template/todoPage.html');
    const html = todoLists.toHtml();
    todoPage = todoPage.replace(/__Project__/, html.join(''));
    res.send(todoPage);
    return;
  }
  res.redirect('/login.html');
};

const serveLoginPage = function(req, res) {
  const url = getAbsUrl(req);
  const content = readFile(url);
  res.send(content);
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
    res.cookie('sessionId', sessionId);
    res.redirect('/todo');
    return;
  }
  res.redirect('/login.html');
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
