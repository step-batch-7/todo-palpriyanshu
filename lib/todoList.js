class Todo {
  constructor(id, title, tasks = []) {
    this.titleId = id;
    this.title = title;
    this.tasks = tasks.slice();
  }

  findTask(taskId) {
    return this.tasks.find(task => task.taskId === taskId);
  }

  delete(taskId) {
    const task = this.findTask(taskId);
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }

  toHtml() {
    return `
     <div class="project" id=${this.titleId}>${this.title}</div>
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
      todoLists.lists.push(new Todo(item.titleId, item.title, item.tasks))
    );
    return todoLists;
  }

  add(todo) {
    const task = new Todo(todo.titleId, todo.title);
    this.lists.push(task);
  }

  toHtml() {
    return this.lists.map(todo => {
      const newItem = new Todo(todo.titleId, todo.title, todo.tasks);
      return newItem.toHtml();
    });
  }

  find(titleId) {
    return this.lists.find(todo => todo.titleId === titleId);
  }

  update(heading, taskDetails) {
    const index = this.lists.indexOf(heading);
    this.lists[index].tasks.push(taskDetails);
  }

  delete(todo) {
    const index = this.lists.indexOf(todo);
    this.lists.splice(index, 1);
  }

  deleteTask(titleId, taskId) {
    const allTodo = this.find(titleId);
    allTodo.delete(taskId);
  }
}

module.exports = {TodoList};
