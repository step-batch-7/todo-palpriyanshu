const isTitleHasValue = function (todo, value) {
  return todo.title.includes(value);
};

const isTaskHasValue = function (todo, value) {
  return todo.tasks.some(task => task.name.includes(value));
};

class Task {
  constructor(id = null, name = '', done = false) {
    this.id = id;
    this.name = name;
    this.done = done;
  }

  update() {
    this.done = !this.done;
  }

  static load(task) {
    return new Task(task.id, task.name, task.done);
  }
}

class Todo {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  addTask(task) {
    this.tasks.push(new Task(task.id, task.name, task.done));
  }

  findTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex(task => task.id === taskId);
    this.tasks.splice(index, 1);
  }

  update(taskId) {
    const task = this.findTask(taskId);
    task.update();
  }

  toHtml() {
    return `
     <div class="project" id=${this.id} onclick="displayTodo('${this.id}')">
     ${this.title}
     </div>
    `;
  }

  static load(todo) {
    const tasks = todo.tasks.map(task => Task.load(task));
    return new Todo(todo.id, todo.title, tasks);
  }
}

class TodoLists {
  constructor(lists) {
    this.lists = lists;
  }

  find(titleId) {
    return this.lists.find(todo => todo.id === titleId);
  }

  add(todo) {
    const newTodo = Todo.load(todo);
    this.lists.push(newTodo);
  }

  delete(todo) {
    const index = this.lists.indexOf(todo);
    this.lists.splice(index, 1);
  }

  addTask(titleId, task) {
    const index = this.lists.findIndex(todo => todo.id === titleId);
    this.lists[index].addTask(task);
  }

  deleteTask(titleId, taskId) {
    const allTodo = this.find(titleId);
    allTodo.deleteTask(taskId);
  }

  updateTask(titleId, taskId) {
    const allTodo = this.find(titleId);
    allTodo.update(taskId);
  }

  editTitle(todoId, title) {
    const todo = this.find(todoId);
    todo.title = title;
  }
  filter(value) {
    if (value) {
      return this.lists.filter(
        todo => isTitleHasValue(todo, value) || isTaskHasValue(todo, value)
      );
    }
    return false;
  }

  toHtml() {
    return this.lists.map(todo => {
      const newItem = Todo.load(todo);
      return newItem.toHtml();
    });
  }

  static load(previousLists) {
    const todoLists = JSON.parse(previousLists || '[]');
    const lists = todoLists.map(todo => Todo.load(todo));
    return new TodoLists(lists);
  }
}

module.exports = TodoLists;
