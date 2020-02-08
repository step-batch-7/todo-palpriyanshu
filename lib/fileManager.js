const {readFileSync} = require('fs');

const TodoList = require('./todoList.js');

const STATIC_FOLDER = `${__dirname}/..`;
const todoStoreUrl = `${STATIC_FOLDER}/dataStore/todoNotes.json`;

class FileManager {
  constructor(url = '', data = []) {
    this.url = url;
    this.data = data;
  }

  static initialise() {
    const dataStore = new FileManager(todoStoreUrl);
    dataStore.data = TodoList.load(readFileSync(todoStoreUrl, 'utf8'));
    return dataStore;
  }

  add(todo) {
    this.data.add(todo);
  }
}

module.exports = FileManager;
