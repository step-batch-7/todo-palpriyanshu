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

const savePost = function(content) {
  writeFile(
    `${STATIC_FOLDER}/dataStore/todoNotes.json`,
    JSON.stringify(content, null, 2),
    () => {}
  );
};

const saveTitle = function(req, res) {
  req.body = querystring.parse(req.body);
  req.body.tasks = [];
  const {title, tasks} = req.body;
  todoList.add({title, tasks});
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end();
};

const saveTask = function(req, res) {
  const previousTitle = JSON.parse(previousTasks).pop();
  req.body = querystring.parse(req.body);
  const {task} = req.body;
  previousTitle.tasks.push(task);
  todoList.updateTodo(previousTitle);
  savePost(todoList.lists);
  res.statusCode = STATUS_CODES.create;
  res.end();
};

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const updateContent = function(content) {
  const template = `
      <div class="heading">
        <p style="margin: 0;">
        hello again
        </p>
      </div>`;

  return content.replace(/__ProjectName__/, template);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(req.body);
    }
    next();
  });
};

const serveTodoPage = function(req, res) {
  let content = readFileSync(`${STATIC_FOLDER}/${req.url}`, 'utf8');
  content = updateContent(content);
  res.end(content);
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
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
};
