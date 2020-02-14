const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const config = require('../config.js');

const STATIC_FOLDER = `${__dirname}/..`;

const getAbsUrl = req => `${STATIC_FOLDER}/public${req.url}`;

const isFileExist = url => existsSync(url) && statSync(url).isFile();

const readFile = url => readFileSync(url, 'utf8');

const saveUserTodos = content =>
  writeFile(config.DATA_STORE, JSON.stringify(content, null, 2), () => {});

module.exports = {
  getAbsUrl,
  isFileExist,
  readFile,
  saveUserTodos
};
