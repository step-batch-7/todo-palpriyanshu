class TodoList {
  constructor() {
    this.todoList = [];
  }

  add(newTodo) {
    this.todoList.shift(newTodo);
  }
}
