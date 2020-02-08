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

  update(allTodos, {task, taskId}) {
    this.data.update(allTodos, {task, taskId});
    this.save();
  }

  delete(titleId) {
    const allTodos = this.find(titleId);
    this.data.find(allTodos);
    this.save();
  }
}

module.exports = {FileManager, read};
