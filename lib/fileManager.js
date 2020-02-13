const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const config = require('../config.js');

const STATIC_FOLDER = `${__dirname}/..`;

const getAbsUrl = req => `${STATIC_FOLDER}/public${req.url}`;

const isFileExist = url => existsSync(url) && statSync(url).isFile();

const readFile = url => {
  return readFileSync(url, 'utf8');
};

const getUserTodos = () => readFile(config.DATA_STORE);

const saveUserTodos = content =>
  writeFile(config.DATA_STORE, JSON.stringify(content, null, 2), () => {});

const getUsersInfo = () => JSON.parse(readFile(config.USERS_STORE));

module.exports = {
  getAbsUrl,
  isFileExist,
  readFile,
  getUserTodos,
  saveUserTodos,
  getUsersInfo
};
