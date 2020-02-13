const assert = require('chai').assert
const { Task } = require('../lib/todoList')

const sampleTask = { id: '1', task: 'firstTask', done: false }

describe("* class Task", function () {
  context("load", function () {
    it("Should load task with proper instance", function () {
      const task = Task.load(sampleTask);
      assert.instanceOf(task, Task);
    })
  })

  context("update", function () {
    it("should update task status", function () {
      const task = new Task(sampleTask);
      assert.instanceOf(task, Task);
      task.update()
      assert.ok(task.done)
    })
  });
});


