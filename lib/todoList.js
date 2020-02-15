class Task {
  constructor(id, name, done) {
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

  filterTasks(value) {
    const {id, title, tasks} = this;
    const matchedTasks = [];
    tasks.forEach(task => {
      if (task.name.includes(value)) {
        matchedTasks.push(task);
      }
    });
    return {id, title, tasks: matchedTasks};
  }

  static load(todo) {
    const tasks = todo.tasks.map(task => Task.load(task));
    return new Todo(todo.id, todo.title, tasks);
  }
}

module.exports = {Todo, Task};
