class Todo {
  constructor(id, title, tasks = []) {
    this.id = id;
    this.title = title;
    this.tasks = tasks.slice();
  }

  toHtml() {
    return `
     <div class="project" id=${this.id}>${this.title}</div>
    `;
  }
}

class TodoList {
  constructor() {
    this.lists = [];
    this.currentPointer = 'T_0';
  }

  static load(previousTasks) {
    const tasks = JSON.parse(previousTasks || '[]');
    const todoLists = new TodoList();
    tasks.forEach(item =>
      todoLists.lists.unshift(new Todo(item.id, item.title, item.tasks))
    );
    return todoLists;
  }

  add(todo) {
    const task = new Todo(todo.id, todo.title, todo.task);
    this.lists.unshift(task);
  }

  toHtml() {
    return this.lists.map(todo => {
      const newItem = new Todo(todo.id, todo.title, todo.tasks);
      return newItem.toHtml();
    });
  }

  getTitle(titleId) {
    return this.lists.find(todo => todo.id === titleId);
  }

  update(heading, task) {
    const index = this.lists.indexOf(heading);
    this.lists[index].tasks.push(task);
  }

  delete(todo) {
    const index = this.lists.indexOf(todo);
    this.lists.splice(index, 1);
  }
}

module.exports = {TodoList};
