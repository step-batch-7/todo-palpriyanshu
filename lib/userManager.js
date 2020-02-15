const {Todo} = require('./todoList');

const filterTodo = (todo, value, matchedTodos) => {
  if (todo.title.includes(value)) {
    matchedTodos.push(todo);
  } else {
    const filteredTodo = todo.filterTasks(value);
    filteredTodo.tasks.length && matchedTodos.push(filteredTodo);
  }
  return matchedTodos;
};

class User {
  constructor(name, username, password, todoLists) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.todoLists = todoLists;
  }

  find(todoId) {
    return this.todoLists.find(todo => todo.id === todoId);
  }

  add(todo) {
    const newTodo = Todo.load(todo);
    this.todoLists.push(newTodo);
  }

  delete(todo) {
    const index = this.todoLists.indexOf(todo);
    this.todoLists.splice(index, 1);
  }

  addTask(todoId, task) {
    const index = this.todoLists.findIndex(todo => todo.id === todoId);
    this.todoLists[index].addTask(task);
  }

  deleteTask(todoId, taskId) {
    const todo = this.find(todoId);
    todo.deleteTask(taskId);
  }

  updateTask(todoId, taskId) {
    const todo = this.find(todoId);
    todo.update(taskId);
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
    this.todoLists.forEach(todo => filterTodo(todo, value, matchedTodos));
    return matchedTodos;
  }

  static createUser(user) {
    const {name, username, password} = user;
    const todoLists = user.todoLists.map(todo => Todo.load(todo));
    return new User(name, username, password, todoLists);
  }
}

class UserManager {
  constructor(usersInfo) {
    this.users = usersInfo;
  }

  addNewUser(name, username, password) {
    const newUser = new User(name, username, password, []);
    this.users.push(newUser);
  }

  getUser(username) {
    return this.users.find(user => user.username == username);
  }

  matchUser(username, password) {
    return this.users.find(
      user => user.username == username && user.password == password
    );
  }

  static initializeUsers(usersData) {
    let usersInfo = JSON.parse(usersData || '[]');
    usersInfo = usersInfo.map(user => User.createUser(user));
    return new UserManager(usersInfo);
  }
}

module.exports = {UserManager};
