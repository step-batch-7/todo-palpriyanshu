const assert = require('chai').assert;
const {Task} = require('../lib/todoList');

const sampleTask = {id: 1, name: 'firstTask', done: false};

describe('* class Task', function() {
  context('load', function() {
    it('Should load or construct task with proper instance', function() {
      const task = Task.load(sampleTask);
      assert.instanceOf(task, Task);
      assert.strictEqual(task.id, 1);
      assert.strictEqual(task.name, 'firstTask');
      assert.isFalse(task.done);
    });
  });

  context('update', function() {
    it('should update task status when previous status was false', function() {
      const task = new Task(sampleTask);
      assert.instanceOf(task, Task);
      task.update();
      assert.isTrue(task.done);
    });

    it('should update task status when previous status was true', function() {
      const task = new Task(sampleTask);
      assert.instanceOf(task, Task);
      task.update();
      task.update();
      assert.isFalse(task.done);
    });
  });
});
