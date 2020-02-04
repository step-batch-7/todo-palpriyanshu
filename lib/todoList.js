class Item {
  constructor(id, title, tasks = []) {
    this.id = id;
    this.title = title;
    this.tasks = tasks.slice();
  }

  add(task) {
    return this.tasks.unshift(task);
  }

  toHtml() {
    return `
    <div class="project">${this.title}</div>
    `;
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
      todoLists.lists.unshift(new Item(item.id, item.title, item.tasks))
    );
    return todoLists;
  }

  add(task) {
    const item = new Item(new Date(), task.title, task.tasks);
    this.lists.unshift(item);
  }

  toHtml() {
    return this.lists.map(todo => {
      const newItem = new Item(todo.id, todo.title, todo.tasks);
      return newItem.toHtml();
    });
  }

  updateTodo(task) {
    this.lists.shift();
    this.add(task);
  }
}

module.exports = {TodoList};
