class TodoList {
  constructor() {
    this.todoList = [];
  }

  static load(previousTasks) {
    const todoList = JSON.parse(previousTasks || '[]');
    return new TodoList(todoList);
  }

  add(newTask) {
    this.todoList.push(newTask);
  }
}

module.exports = TodoList;
