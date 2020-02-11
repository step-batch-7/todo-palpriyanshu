const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const askToDelete = function(titleId) {
  if (event.target.classList[0] === 'yes') {
    const callBack = () => {
      document.querySelector('#todo').innerText = '';
      hide('.myTasks');
      erase(`#${titleId}`);
    };
    newRequest('POST', 'deleteAllTodo', callBack, {titleId});
  }
  hide('.dialogBox');
};

const deleteTodo = function() {
  const id = event.target.id;
  show('.dialogBox');
  document.querySelector('.dialogBox').onclick = askToDelete.bind(null, id);
};

const deleteTask = function() {
  const myTasks = document.querySelector('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`#${taskId}`);
  newRequest('POST', 'deleteTask', callBack, {titleId, taskId});
};

const createBlock = function(task) {
  const {id, name, done} = task;
  const isChecked = done ? 'checked' : '';
  return `<div class="display" id="${id}">
  <input type="checkBox" class="check" onclick="updateStatus()" ${isChecked}>
  <div class="heading">${name}</div>
  <img src="../images/minus.png" class="titleImg delete" onclick="deleteTask()">
  </div>`;
};

const createTask = function(tasks) { 
  return tasks.map(task => createBlock(task)).join('\n');
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
  const myAllTasks = document.getElementById('myAllTasks');
  myAllTasks.innerHTML = todoBlockAsHtml(todoId);
  const callBack = function() {
    if (this.status === 201) {
      const todo = JSON.parse(this.response).tasks;
      document.getElementById('todo').innerHTML = createTask(todo);
    }
  };
  newRequest('POST', 'loadTask', callBack, {todoId});
};

const addToTodoList = function({id, title}) {
  const todoLists = document.getElementById('allTodos');
  const html = `<div class="project" id="${id}" onclick="displayTodo('${id}')">
     ${title} </div>`;
  todoLists.innerHTML += html;
};

const createTodo = function() {
  const textBox = document.getElementById('titlePlace');
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
  console.log(titleId);
  const todoBlock = document.getElementById('todo');
  const textBox = document.getElementById('task');
  const name = textBox.value;
  textBox.value = '';
  const callBack = function() {
    const task = JSON.parse(this.response);
    todoBlock.innerHTML += createBlock(task);
  };

  newRequest('POST', 'saveTask', callBack, {name, titleId});
};

const updateStatus = function() {
  const myTasks = document.querySelector('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const filterTodo = function() {
  const searchValue = event.target.value;
  const callback = function() {
    const matchedValue = JSON.parse(this.response);
    const form = document.querySelector('#myAllTasks');
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
  const index = document.getElementById('index');
  index.classList.toggle('index');
  if (index.className === 'hidden') {
    document.getElementById('textArea').style.width = '1170px';
    show('#index');
    return;
  }
  hide('#index');
  document.getElementById('textArea').style.width = '1370px';
};

const attachClickEventListeners = () => {
  document.querySelector('#fold').addEventListener('click', renderIndex);
  document.querySelector('#saveTitle').addEventListener('click', createTodo);
  document.querySelector('#allTodos').addEventListener('dblclick', deleteTodo);
  document.querySelector('.searchBar').addEventListener('keyup', filterTodo);
};

window.onload = attachClickEventListeners;
