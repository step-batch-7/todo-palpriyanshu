const getElement = selector => document.querySelector(selector);

const hide = selector => getElement(selector).classList.add('hidden');

const show = selector => getElement(selector).classList.remove('hidden');

const erase = id => document.getElementById(id).remove();

const deleteTodo = function(todoId) {
  const callBack = () => {
    getElement('#todo').innerText = '';
    hide('.myTasks');
    erase(`${todoId}`);
  };
  newRequest('POST', 'deleteAllTodo', callBack, {todoId});
  hide('.dialogBox');
};

const showDeleteDialogBox = function() {
  const id = event.target.id;
  show('.dialogBox');
  getElement('.delete').setAttribute('onclick', `deleteTodo('${id}')`);
  getElement('.cancel').setAttribute('onclick', 'hide(".dialogBox")');
};

const deleteTask = function() {
  const myTasks = getElement('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`${taskId}`);
  newRequest('POST', 'deleteTask', callBack, {titleId, taskId});
};

const createBlock = function(task) {
  const {id, name, done} = task;
  const isChecked = done ? 'checked' : '';
  return `<div class="display" id="${id}">
  <input type="checkBox" class="check" onclick="updateStatus()" ${isChecked}>
  <div class="heading">${name}</div>
  <img src="../images/minus.png" class="titleImg minus" onclick="deleteTask()">
  </div>`;
};

const todoBlockAsHtml = function(todoId) {
  return `
  <div class="myTasks" id="c.${todoId}">
    <div id="taskInput" class="display">
      <input placeholder="add Task" type="text" id="task" required />
      <img src="../images/plus.png" class="titleImg" id="addButton" onclick = "addNewTask('${todoId}')"/>
    </div>
    <br />
    <br />
    <div id="todo"></div>
  </div>`;
};

const displayTodo = function(todoId) {
  const myAllTasks = getElement('#myAllTasks');
  myAllTasks.innerHTML = todoBlockAsHtml(todoId);
  const callBack = function() {
    if (this.status === 201) {
      const tasks = JSON.parse(this.response).tasks;
      const todo = getElement('#todo');
      todo.innerHTML = tasks.map(task => createBlock(task)).join('\n');
    }
  };
  newRequest('POST', 'loadTask', callBack, {todoId});
};

const addToTodoList = function({id, title}) {
  const todoLists = getElement('#allTodos');
  const html = `<div class="project" id="${id}" onclick="displayTodo('${id}')">
     ${title} </div>`;
  todoLists.innerHTML += html;
};

const createTodo = function() {
  const textBox = getElement('#titlePlace');
  const title = textBox.value;
  textBox.value = '';
  const callBack = function() {
    if (this.status === 201) {
      addToTodoList(JSON.parse(this.response));
    }
  };
  newRequest('POST', 'saveTitle', callBack, {title});
};

const addNewTask = function(titleId) {
  const todoBlock = getElement('#todo');
  const textBox = getElement('#task');
  const name = textBox.value;
  textBox.value = '';
  const callBack = function() {
    const task = JSON.parse(this.response);
    todoBlock.innerHTML += createBlock(task);
  };

  newRequest('POST', 'saveTask', callBack, {name, titleId});
};

const updateStatus = function() {
  const myTasks = getElement('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const filterTodo = function() {
  const searchValue = event.target.value;
  const callback = function() {
    const matchedValue = JSON.parse(this.response);
    const form = getElement('#myAllTasks');
    form.innerHTML = '';
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
  index.classList.toggle('index');
  if (index.className === 'hidden') {
    getElement('#textArea').style.width = '1170px';
    show('#index');
    return;
  }
  hide('#index');
  getElement('#textArea').style.width = '1370px';
};

// const displayTodoPage = () => {

// }
const attachClickEventListeners = () => {
  getElement('#fold').addEventListener('click', renderIndex);
  getElement('#saveTitle').addEventListener('click', createTodo);
  getElement('#allTodos').addEventListener('dblclick', showDeleteDialogBox);
  getElement('.searchBar').addEventListener('keyup', filterTodo);
};

window.onload = attachClickEventListeners;
