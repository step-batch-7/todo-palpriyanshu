class Task {
  constructor(id = null, task = '', done = false) {
    this.taskId = id;
    this.task = task;
    this.done = done;
  }

  update() {
    this.done = !this.done;
  }
}

class Todo {
  constructor(id = null, title = '', tasks = []) {
    this.titleId = id;
    this.title = title;
    this.tasks = tasks;
  }

  static load(previousTodo) {
    const todo = previousTodo || {tasks: []};
    const taskList = new Todo(todo.titleId, todo.title);
    todo.tasks.forEach(task => {
      taskList.tasks.push(new Task(task.taskId, task.task, task.done));
    });
    return taskList;
  }

  findTask(taskId) {
    return this.tasks.find(task => task.taskId === taskId);
  }

  delete(taskId) {
    const task = this.findTask(taskId);
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }

  update(taskId) {
    const task = this.findTask(taskId);
    task.update();
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

  static load(previousLists) {
    const tasks = JSON.parse(previousLists || '[]');
    const todoLists = new TodoList();
    tasks.forEach(item => todoLists.add(item));
    return todoLists;
  }

  add(todo) {
    const task = Todo.load(todo);
    this.lists.push(task);
  }

  toHtml() {
    return this.lists.map(todo => {
      const newItem = Todo.load(todo);
      return newItem.toHtml();
    });
  }

  find(titleId) {
    return this.lists.find(todo => todo.titleId === titleId);
  }

  update(heading, task) {
    const index = this.lists.indexOf(heading);
    this.lists[index].tasks.push(task);
  }

  delete(todo) {
    const index = this.lists.indexOf(todo);
    this.lists.splice(index, 1);
  }

  deleteTask(titleId, taskId) {
    const allTodo = this.find(titleId);
    allTodo.delete(taskId);
  }

  updateTask(titleId, taskId) {
    const allTodo = this.find(titleId);
    allTodo.update(taskId);
  }
}

module.exports = TodoList;
