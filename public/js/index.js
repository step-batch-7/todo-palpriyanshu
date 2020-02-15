const getElement = selector => document.querySelector(selector);

const getChildElement = (parentElement, selector) =>
  parentElement.querySelector(selector);

const hide = selector => getElement(selector).classList.add('hidden');

const show = selector => getElement(selector).classList.remove('hidden');

const erase = id => document.getElementById(id).remove();

const highlightText = (text, searchText) => {
  const highlightedText = `<span class="highlight">${searchText}</span>`;
  return text.replace(searchText, highlightedText);
};

const tasksAsHtml = function(todoId, tasks, searchText) {
  return tasks
    .map(({id, name, done}) => {
      return `<div class="display todoTask" id="${id}">
    <input type="checkBox" class="check" onclick="updateStatus()" ${
      done ? 'checked' : ''
    }>
    <div class="taskName" contenteditable="true" onblur="editTask('${todoId}','${id}',this)">
      ${highlightText(name, searchText)}
    </div>
    <img src="../images/minus.png" class="titleImg minus" onclick="deleteTask()">
  </div>`;
    })
    .join('\n');
};

const todoBlockAsHtml = function({id, title, tasks}, searchText) {
  return `
  <div class="myTasks" id="c.${id}">
    <div class="display">
      <span class="title" contenteditable="true" onblur="editTitle('${id}',this)">
        ${highlightText(title, searchText)}
      </span>
    </div>
    <div id="taskInput" class="display">
      <input placeholder="add Task" type="text" class="task" required />
      <img src="../images/plus.png" class="titleImg" id="addButton" onclick = "addNewTask('${id}')"/>
    </div>
    <br />
    <br />
    <div id="todo">${tasksAsHtml(id, tasks, searchText)} </div>
  </div>`;
};

const displayTodo = function(todoId) {
  const callBack = function() {
    if (this.status === 200) {
      const todos = JSON.parse(this.response);
      const myAllTasks = getElement('#myAllTasks');
      myAllTasks.innerHTML = todos.map(todo => todoBlockAsHtml(todo));
    }
  };
  newRequest('POST', 'loadTask', callBack, {todoId});
};

const addToTodoList = function({id, title}) {
  const todoLists = getElement('#allTodos');
  const html = `<div class="todoTitle" id="${id}" onclick="displayTodo('${id}')">
     ${title} 
     </div>`;
  todoLists.innerHTML += html;
};

const createTodo = function() {
  const textBox = getElement('#titlePlace');
  const title = textBox.value;
  textBox.value = '';
  const callBack = function() {
    if (this.status === 200) {
      addToTodoList(JSON.parse(this.response));
    }
  };
  newRequest('POST', 'saveTitle', callBack, {title});
};

const deleteTodo = function(todoId) {
  const callBack = () => {
    getElement('#todo').innerText = '';
    hide('.myTasks');
    erase(`${todoId}`);
  };
  newRequest('DELETE', 'deleteAllTodo', callBack, {todoId});
  hide('.dialogBox');
};

const showDeleteDialogBox = function() {
  const id = event.target.id;
  show('.dialogBox');
  getElement('.delete').setAttribute('onclick', `deleteTodo('${id}')`);
  getElement('.cancel').setAttribute('onclick', 'hide(".dialogBox")');
};

const addNewTask = function(todoId) {
  const todoDivision = document.getElementById(`c.${todoId}`);
  const taskDivision = getChildElement(todoDivision, '#todo');
  const taskInput = getChildElement(todoDivision, '#taskInput');
  const textBox = getChildElement(taskInput, '.task');
  const name = textBox.value;
  textBox.value = '';
  const callBack = function() {
    const task = JSON.parse(this.response);
    taskDivision.innerHTML += tasksAsHtml(todoId, [task]);
  };

  newRequest('POST', 'saveTask', callBack, {name, todoId});
};

const deleteTask = function() {
  const myTasks = getElement('.myTasks');
  const todoId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`${taskId}`);
  newRequest('DELETE', 'deleteTask', callBack, {todoId, taskId});
};

const updateStatus = function() {
  const myTasks = getElement('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  newRequest('PATCH', 'updateTaskStatus', true, {titleId, taskId});
};

const editTitle = function(todoId, titleDivision) {
  const callBack = function() {
    const newTitle = JSON.parse(this.response);
    const title = getElement('.title');
    const todo = getElement(`#${todoId}`);
    title.innerText = newTitle;
    todo.innerText = newTitle;
  };
  const title = titleDivision.innerText;
  newRequest('POST', 'editTitle', callBack, {todoId, title});
};

const editTask = function(todoId, taskId, taskDivision) {
  const callBack = function() {
    const newTask = JSON.parse(this.response);
    const taskDivision = getElement(`#${taskId}`);
    const taskName = getChildElement(taskDivision, '.taskName');
    taskName.innerText = newTask;
  };
  const name = taskDivision.innerText;
  newRequest('POST', 'editTask', callBack, {todoId, taskId, name});
};

const filterTodo = function() {
  const searchValue = event.target.value;
  const callback = function() {
    const matchedTodos = JSON.parse(this.response);
    const form = getElement('#myAllTasks');
    form.innerHTML = matchedTodos
      .map(todo => todoBlockAsHtml(todo, searchValue))
      .join('');
  };
  newRequest('POST', 'filterTodo', callback, {searchValue});
};

const newRequest = function(method, url, callBack, reqMsg) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('content-type', 'application/json');
  req.onload = callBack;
  req.send(JSON.stringify(reqMsg));
};

const renderIndex = function() {
  const index = getElement('#index');
  index.classList.toggle('hidden');
};

const attachClickEventListeners = () => {
  getElement('#fold').addEventListener('click', renderIndex);
  getElement('#saveTitle').addEventListener('click', createTodo);
  getElement('#allTodos').addEventListener('dblclick', showDeleteDialogBox);
  getElement('.searchBar').addEventListener('keyup', filterTodo);
};

const listTodos = function() {
  const todos = JSON.parse(this.response);
  todos.forEach(todo => addToTodoList(todo));
};

const loadTodos = () => newRequest('GET', 'serveTodos', listTodos, '');

const main = () => {
  attachClickEventListeners();
  loadTodos();
};

window.onload = main;
