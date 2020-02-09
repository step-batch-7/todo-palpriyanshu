const {existsSync, statSync, readFileSync, writeFile} = require('fs');
const config = require('../config.js');

const TodoList = require('./todoList.js');

const STATIC_FOLDER = `${__dirname}/..`;

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

const isFileExist = url => existsSync(url) && statSync(url).isFile();

const read = url => readFileSync(`${STATIC_FOLDER}/${url}`, 'utf8');

class TodoStore {
  constructor(url = '', data = []) {
    this.url = url;
    this.data = data;
  }

  static initialize() {
    const dataStore = new TodoStore(config.DATA_STORE);
    dataStore.data = TodoList.load(readFileSync(config.DATA_STORE, 'utf8'));
    return dataStore;
  }

  save() {
    writeFile(this.url, JSON.stringify(this.data.lists, null, 2), () => {});
  }

  add(todo) {
    this.data.add(todo);
    this.save();
  }

  toHtml() {
    return this.data.toHtml();
  }

  find(titleId) {
    return this.data.find(titleId);
  }

  update(allTodos, task) {
    this.data.update(allTodos, task);
    this.save();
  }

  delete(titleId) {
    const allTodos = this.find(titleId);
    this.data.delete(allTodos);
    this.save();
  }

  deleteTask(titleId, taskId) {
    this.data.deleteTask(titleId, taskId);
    this.save();
  }

  updateTask(titleId, taskId) {
    this.data.updateTask(titleId, taskId);
    this.save();
  }
}

module.exports = {TodoStore, read, getAbsUrl, isFileExist};
