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

const serveStaticFiles = function(req, res, next) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  const absPath = `${STATIC_FOLDER}/public${req.url}`;
  const stat = existsSync(absPath) && statSync(absPath).isFile();
  if (!stat) {
    return next();
  }
  const content = readFileSync(absPath);
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

module.exports = {serveStaticFiles, notFound, methodNotAllowed};
