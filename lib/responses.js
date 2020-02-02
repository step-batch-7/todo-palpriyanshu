const {existsSync, statSync, readFileSync} = require('fs');
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
  let absPath = `${STATIC_FOLDER}/public${req.url}`;

  if (req.url === '/template/todoPage.html') {
    absPath = `${STATIC_FOLDER}${req.url}`;
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

const servePost = function(req, res) {
  res.statusCode = STATUS_CODES.redirect;
  res.setHeader('location', '/template/todoPage.html');
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

module.exports = {serveStaticFiles, servePost, notFound, methodNotAllowed};
