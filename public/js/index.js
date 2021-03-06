const getElement = selector => document.querySelector(selector);

const getChildElement = (parentElement, selector) =>
  parentElement.querySelector(selector);

const hide = selector => getElement(selector).classList.add('hidden');

const show = selector => getElement(selector).classList.remove('hidden');

const erase = id => document.getElementById(id).remove();

const toggleLogoutPopUp = () => {
  const logoutPopUp = getElement('#logoutPopUp');
  logoutPopUp.classList.toggle('hidden');
};

const toggleHelpPopUp = () => {
  const logoutPopUp = getElement('#helpPopUp');
  logoutPopUp.classList.toggle('hidden');
};

const highlightText = (text, searchText) => {
  if (!searchText) {
    return text;
  }
  const highlightedText = `<span class="highlight">${searchText}</span>`;
  return text.replace(new RegExp(searchText, 'g'), highlightedText);
};

const tasksAsHtml = function(todoId, tasks, searchText) {
  return tasks
    .map(({id, name, done}) => {
      return `
    <div class="display todoTask ${done ? 'checkedTaskName' : ''}" id="${id}">
    <input type="checkBox" class="check" onclick="updateStatus()" ${
      done ? 'checked' : ''
    }>
    <div class="taskName" 
      contenteditable="true" onblur="editTask('${todoId}','${id}',this)">
      ${highlightText(name, searchText)}
    </div>
    <img src="../images/delete.png" class="minus" onclick="deleteTask()">
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
    <br />
    <br />
    <div id="todo">${tasksAsHtml(id, tasks, searchText)} </div>
    <div id="taskInput" class="display">
      <input placeholder="Add Task" type="text" class="taskName task" required onkeyup="addTask('${id}')"/>
      <img src="../images/plus.png" id="addButton" onclick = "addNewTask('${id}')"/>
  </div>
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
     <div>${title}</div>
     <div> 
      <img src="./images/bin.png" alt="no image" onclick="showDeleteDialogBox('${id}')" class="bin"/>
     </div>
     </div>`;
  todoLists.innerHTML += html;
};

const createTodo = function() {
  const textBox = getElement('#titlePlace');
  let title = textBox.value.replace(/>/g, '&gt;');
  title = textBox.value.replace(/</g, '&lt;');
  if (title.trim() == '') return;
  textBox.value = '';
  const callBack = function() {
    if (this.status === 200) {
      addToTodoList(JSON.parse(this.response));
    }
  };
  newRequest('POST', 'saveTitle', callBack, {title});
};

const createNewTodo = function() {
  if (event.key === 'Enter') createTodo();
  return;
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

const showDeleteDialogBox = function(todoId) {
  show('.dialogBox');
  getElement('.delete').setAttribute('onclick', `deleteTodo('${todoId}')`);
  getElement('.cancel').setAttribute('onclick', 'hide(".dialogBox")');
};

const addNewTask = function(todoId) {
  const todoDivision = document.getElementById(`c.${todoId}`);
  const taskDivision = getChildElement(todoDivision, '#todo');
  const taskInput = getChildElement(todoDivision, '#taskInput');
  const textBox = getChildElement(taskInput, '.task');
  let name = textBox.value.replace(/>/g, '&gt;');
  name = textBox.value.replace(/</g, '&lt;');
  if (name === '') return;
  textBox.value = '';
  const callBack = function() {
    const task = JSON.parse(this.response);
    taskDivision.innerHTML += tasksAsHtml(todoId, [task]);
  };

  newRequest('POST', 'saveTask', callBack, {name, todoId});
};

const addTask = todoId => {
  if (event.key === 'Enter') addNewTask(todoId);
  return;
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
  const callBack = () => {
    const task = getElement(`#${taskId}`);
    task.classList.toggle('checkedTaskName');
  };
  newRequest('PATCH', 'updateTaskStatus', callBack, {titleId, taskId});
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

const toggleIndexBar = function() {
  const indexBar = getElement('#indexBar');
  const leftArrow = getElement('#leftArrow');
  const rightArrow = getElement('#rightArrow');
  indexBar.classList.toggle('hidden');
  leftArrow.classList.toggle('hidden');
  rightArrow.classList.toggle('hidden');
};

const attachEventListeners = () => {
  getElement('#leftArrow').addEventListener('click', toggleIndexBar);
  getElement('#rightArrow').addEventListener('click', toggleIndexBar);
  getElement('#saveTitle').addEventListener('click', createTodo);
  getElement('#titlePlace').addEventListener('keyup', createNewTodo);
  getElement('.searchBar').addEventListener('keyup', filterTodo);
};

const listTodos = function() {
  const todos = JSON.parse(this.response);
  todos.forEach(todo => addToTodoList(todo));
};

const loadTodos = () => newRequest('GET', 'serveTodos', listTodos, '');

const main = () => {
  attachEventListeners();
  loadTodos();
  loadInstructions();
};

window.onload = main;
