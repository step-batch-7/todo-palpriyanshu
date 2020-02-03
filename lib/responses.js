const {existsSync, statSync, readFileSync, writeFileSync} = require('fs');
const querystring = require('querystring');
const CONTENT_TYPE = require('./mimeTypes.js');
const STATUS_CODES = require('./statusCodes.js');
const STATIC_FOLDER = `${__dirname}/..`;

const successFulResponse = function(req, res, content) {
  const extension = req.url.split('.').pop();
  const contentType = CONTENT_TYPE[extension];
  res.setHeader('content-type', contentType);
  res.end(content);
};

const getAbsUrl = function(req) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  const absPath = `${STATIC_FOLDER}/public${req.url}`;

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

const savePost = function(contentType, body) {
  if (contentType === 'application/x-www-form-urlencoded') {
    const post = querystring.parse(body);
    post.todoList = [];
    writeFileSync(
      `${STATIC_FOLDER}/dataStore/todoNotes.json`,
      JSON.stringify([post], null, 2)
    );
  }
};

const loadAndSavePost = function(req) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    savePost(req.headers['content-type'], body);
  });
};

const servePost = function(req, res) {
  loadAndSavePost(req);
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
  res.end();
};

const template = `
      <div class="heading">
        <p style="margin: 0;">
          hello
        </p>
      </div>`;

const serveTodoPage = function(req, res) {
  let content = readFileSync(`${STATIC_FOLDER}/${req.url}`, 'utf8');
  content = content.replace(/__ProjectName__/, template);
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
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
};
