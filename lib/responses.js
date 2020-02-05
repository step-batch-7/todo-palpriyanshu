const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');
const {TodoList} = require('./todoList.js');

const STATIC_FOLDER = `${__dirname}/..`;

const previousTasks = readFileSync(
  `${STATIC_FOLDER}/dataStore/todoNotes.json`,
  'utf8'
);

const todoList = TodoList.load(previousTasks);

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

const savePost = function(post) {
  writeFile(
    `${STATIC_FOLDER}/dataStore/todoNotes.json`,
    JSON.stringify(post, null, 2),
    () => {}
  );
};

const saveTitle = function(req, res) {
  const {title, id, tasks} = req.body;
  todoList.add({title, id, tasks});
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end();
};

const saveTask = function(req, res) {
  const heading = todoList.getTitle(req.body.titleId);
  const task = req.body.task;
  todoList.update(heading, task);
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end();
};

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const loadTask = function(req, res) {
  return servePost(req, res);
};

const renderTodoPage = function(todoList) {
  let todoPage = readFileSync(
    `${STATIC_FOLDER}/template/todoPage.html`,
    'utf8'
  );
  const html = todoList.toHtml();
  todoPage = todoPage.replace(/__Project__/, html.join('\n'));
  return todoPage;
};

const formatTodoDetails = function(req, data) {
  const todoDetails = querystring.parse(data);
  if (todoList.tasks) {
    todoDetails.tasks = JSON.parse(todoDetails.tasks) || [];
  }
  return todoDetails;
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = formatTodoDetails(req, data);
    next();
  });
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

module.exports = {
  readBody,
  saveTitle,
  saveTask,
  loadTask,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
};
