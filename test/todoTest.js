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
    it('Should load or construct todo with proper instance', function() {
      const todo = Todo.load(sampleTodo);
      todo.addTask(sampleTask);
      assert.instanceOf(todo, Todo);
      assert.strictEqual(todo.tasks.length, 2);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'firstTodo');
    });
  });
});
