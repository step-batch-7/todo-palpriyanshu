const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const config = require('../config.js');

const STATIC_FOLDER = `${__dirname}/..`;

const getAbsUrl = function(req) {
  // if (req.url === '/') {
  //   req.url = '/template/todoPage.html';
  // }
  return `${STATIC_FOLDER}/public${req.url}`;
};

const isFileExist = url => existsSync(url) && statSync(url).isFile();

const readFile = url => readFileSync(url, 'utf8');

const getUserTodos = (path, username) => {
  const url = `${path}/${username}.json`;
  if (isFileExist(url)) {
    return readFile(url);
  }
  return '';
};

const saveUserTodos = content =>
  writeFile(config.DATA_STORE, JSON.stringify(content, null, 2), () => {});

const getUsersInfo = () => readFile(config.USERS_STORE);

module.exports = {
  getAbsUrl,
  isFileExist,
  readFile,
  getUserTodos,
  saveUserTodos,
  getUsersInfo
};
