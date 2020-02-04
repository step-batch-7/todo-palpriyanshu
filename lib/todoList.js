class Item {
  constructor(id, title, tasks = []) {
    this.id = id;
    this.title = title;
    this.tasks = tasks.slice();
  }

  add(task) {
    return this.tasks.push(task);
  }
}

class TodoList {
  constructor() {
    this.lists = [];
  }

  static load(previousTasks) {
    const tasks = JSON.parse(previousTasks || '[]');
    const todoLists = new TodoList();
    tasks.forEach(item =>
      todoLists.lists.push(new Item(item.id, item.title, item.tasks))
    );
    return todoLists;
  }

  add(task) {
    const item = new Item(new Date(), task.title, task.tasks);
    this.lists.push(item);
  }

  updateTodo(task) {
    this.lists.pop();
    this.add(task);
  }
}

module.exports = {TodoList};
