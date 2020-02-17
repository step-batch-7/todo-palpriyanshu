const assert = require('chai').assert;
const {User, UserManager} = require('../lib/userManager');

const todoLists = [
  {
    id: 1,
    title: 'firstTodo',
    tasks: [{id: 1, name: 'firstTask', done: false}]
  },
  {
    id: 2,
    title: 'SecondTodo',
    tasks: [{id: 1, name: 'SecondTask', done: false}]
  }
];
const userDetails = {
  name: 'santhosh',
  username: 'kumar',
  password: 1234,
  todoLists
};

describe('User class', function() {
  describe('find', function() {
    it('should give matched todo for given todoId ', function() {
      const user = User.createUser(userDetails);
      const actual = user.find(2);
      assert.deepStrictEqual(actual, todoLists[1]);
    });
  });

  describe('add', function() {
    it('should add new todo to todoLists of user', function() {
      const user = User.createUser(userDetails);
      const todo = {
        id: 3,
        title: 'ThirdTodo',
        tasks: [{id: 1, name: 'ThirdTask', done: false}]
      };
      user.add(todo);
      assert.strictEqual(user.todoLists.length, 3);
    });
  });

  describe('delete', function() {
    it('should delete todo of given todoId', function() {
      const user = User.createUser(userDetails);
      user.delete(2);
      assert.strictEqual(user.todoLists.length, 1);
    });
  });

  describe('addTask', function() {
    it('should add task to given todoId', function() {
      const user = User.createUser(userDetails);
      const sampleTask = {id: 2, name: 'secondTask', done: false};
      user.addTask(2, sampleTask);
      assert.strictEqual(user.todoLists[1].tasks.length, 2);
    });
  });

  describe('deleteTask', function() {
    it('should delete task of given taskId', function() {
      const user = User.createUser(userDetails);
      user.deleteTask(2, 1);
      assert.strictEqual(user.todoLists[1].tasks.length, 0);
    });
  });

  describe('find', function() {
    it('should update task of given taskId', function() {
      const user = User.createUser(userDetails);
      user.updateTask(2, 1);
      assert.isTrue(user.todoLists[1].tasks[0].done);
    });
  });

  describe('editTitle', function() {
    it('should edit the title of given todoId', function() {
      const user = User.createUser(userDetails);
      user.editTitle(2, 'lastTodo');
      assert.strictEqual(user.todoLists[1].title, 'lastTodo');
    });
  });

  describe('editTask', function() {
    it('should edit the task of given taskId', function() {
      const user = User.createUser(userDetails);
      user.editTask(2, 1, 'lastTask');
      assert.strictEqual(user.todoLists[1].tasks[0].name, 'lastTask');
    });
  });

  describe('filterTodos', function() {
    it('should filter the todo using given value', function() {
      const user = User.createUser(userDetails);
      assert.deepStrictEqual(user.filterTodos('SecondTask'), [
        user.todoLists[1]
      ]);
    });
  });
});
