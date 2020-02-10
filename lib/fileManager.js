const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const config = require('../config.js');

const STATIC_FOLDER = `${__dirname}/..`;

const getAbsUrl = function(req) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  return `${STATIC_FOLDER}/public${req.url}`;
};

const isFileExist = url => existsSync(url) && statSync(url).isFile();

const readFile = url => readFileSync(url, 'utf8');

const save = content =>
  writeFile(config.DATA_STORE, JSON.stringify(content, null, 2), () => {});

module.exports = {readFile, getAbsUrl, isFileExist, save};
