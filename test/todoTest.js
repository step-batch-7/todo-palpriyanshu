const assert = require('chai').assert;
const {Todo, Task} = require('../lib/todoList');

const sampleTodo = {
  id: 1,
  title: 'firstTodo',
  tasks: [{id: 1, name: 'firstTask', done: false}]
};

const sampleTask = {id: 2, name: 'secondTask', done: false};

describe('* class Todo', function() {
  context('load', function() {
    it('Should load or construct todo with proper instance', function() {
      const todo = Todo.load(sampleTodo);
      assert.instanceOf(todo, Todo);
      assert.instanceOf(todo.tasks[0], Task);
      assert.ok(todo.id, 1);
      assert.ok(todo.title, 'firstTodo');
    });
  });

  context('addTask', function() {
    it('Should add new task when sample task is given', function() {
      const todo = Todo.load(sampleTodo);
      todo.addTask(sampleTask);
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.tasks.length, 2);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
    });
  });

  context('deleteTask', function() {
    it('Should delete task when task id is given', function() {
      const todo = Todo.load(sampleTodo);
      todo.deleteTask(sampleTask.id);
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.tasks.length, 0);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
    });
  });

  context('update', function() {
    it('Should update task status when task id is given', function() {
      const todo = Todo.load(sampleTodo);
      todo.update(1);
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.tasks.length, 1);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
      assert.isTrue(todo.tasks[0].done);
    });
  });

  context('editTask', function() {
    it('Should edit task name when task id and new task name is given', function() {
      const todo = Todo.load(sampleTodo);
      todo.editTask(1, 'first task edited');
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.tasks.length, 1);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
      assert.strictEqual(todo.tasks[0].name, 'first task edited');
    });
  });

  context('findTask', function() {
    it('Should find task when task id is given', function() {
      const sampleTodo = {
        id: 1,
        title: 'firstTodo',
        tasks: [
          {id: 1, name: 'firstTask', done: false},
          {id: 2, name: 'secondTask', done: false}
        ]
      };

      const todo = Todo.load(sampleTodo);
      assert.deepStrictEqual(todo.findTask(1), todo.tasks[0]);
    });
  });

  context('filterTask', function() {
    const sampleTodo = {
      id: 1,
      title: 'firstTodo',
      tasks: [
        {id: 1, name: 'firstTask', done: false},
        {id: 2, name: 'secondTask', done: false}
      ]
    };
    it('Should filter tasks when new text is given', function() {
      const todo = Todo.load(sampleTodo);
      const expected = {
        id: 1,
        title: 'firstTodo',
        tasks: [{id: 1, name: 'firstTask', done: false}]
      };
      assert.deepStrictEqual(todo.filterTasks('firstTask'), expected);
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
    });
  });
});
