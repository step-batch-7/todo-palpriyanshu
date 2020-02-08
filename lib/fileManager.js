const {readFileSync, writeFile} = require('fs');

const TodoList = require('./todoList.js');

const STATIC_FOLDER = `${__dirname}/..`;
const todoStoreUrl = `${STATIC_FOLDER}/dataStore/todoNotes.json`;

const read = url => readFileSync(`${STATIC_FOLDER}/${url}`, 'utf8');

class FileManager {
  constructor(url = '', data = []) {
    this.url = url;
    this.data = data;
  }

  static initialize() {
    const dataStore = new FileManager(todoStoreUrl);
    dataStore.data = TodoList.load(readFileSync(todoStoreUrl, 'utf8'));
    return dataStore;
  }

  add(todo) {
    this.data.add(todo);
  }

  save() {
    writeFile(this.url, JSON.stringify(this.data.lists, null, 2), () => {});
  }

  toHtml() {
    return this.data.toHtml();
  }
}

module.exports = {FileManager, read};
