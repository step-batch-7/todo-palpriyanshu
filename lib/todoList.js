const filterTodo = (todo, value, matchedTodos) => {
  if (todo.title.includes(value)) {
    matchedTodos.push(todo);
  }
  else {
    const filteredTodo = todo.filterTasks(value);
    filteredTodo.tasks.length && matchedTodos.push(filteredTodo);
  }
  return matchedTodos;
}

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

  findTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  addTask(task) {
    this.tasks.push(new Task(task.id, task.name, task.done));
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex(task => task.id === taskId);
    this.tasks.splice(index, 1);
  }

  update(taskId) {
    const task = this.findTask(taskId);
    task.update();
  }

  editTask(taskId, name) {
    const task = this.findTask(taskId);
    task.name = name;
  }
  toHtml() {
    return `
     <div class="project" id=${this.id} onclick="displayTodo('${this.id}')">
     ${this.title}
     </div>
    `;
  }

  filterTasks(value) {
    const { id, title, tasks } = this;
    const matchedTasks = [];
    tasks.forEach(task => {
      if (task.name.includes(value)) {
        matchedTasks.push(task);
      }
    });
    return { id, title, tasks: matchedTasks }
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

  editTask(todoId, taskId, name) {
    const todo = this.find(todoId);
    todo.editTask(taskId, name);
  }

  filterTodos(value) {
    const matchedTodos = [];
    if (!value) {
      return matchedTodos;
    }
    this.lists.forEach(todo => filterTodo(todo, value, matchedTodos))
    return matchedTodos;
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
