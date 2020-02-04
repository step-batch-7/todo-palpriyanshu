class TodoList {
  constructor() {
    this.lists = [];
  }

  static load(previousTasks) {
    const tasks = JSON.parse(previousTasks || '[]');
    const todoLists = new TodoList();
    tasks.forEach(task => todoLists.lists.push(task));
    return todoLists;
  }

  add(newTask) {
    this.lists.push(newTask);
  }
}

module.exports = TodoList;
