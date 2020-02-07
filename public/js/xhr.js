const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const displayTodo = function(todo, taskId, done) {
  let checked = '';
  if (done) {
    checked = 'checked';
  }
  return `
  <div class="display" id="${taskId}">
    <input type="checkBox" class="check" onClick="updateStatus()" ${checked}>
    <div class="heading">${todo}</div>
    <div class="delete" onClick="deleteTask()"> _ </div>
  </div>
  `;
};

const askToDelete = function(titleId) {
  if (event.target.classList[0] === 'yes') {
    const callBack = () => {
      erase('.myTasks');
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
  const titleId = document
    .querySelector('.myTasks')
    .id.split('.')
    .pop();
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`#${taskId}`);
  newRequest('POST', 'deleteTask', callBack, {titleId, taskId});
};

const renderTodos = function() {
  const button = document.getElementById('addButton');
  show('.myTasks');
  const titleId = event.target.id;
  document.querySelector('.myTasks').setAttribute('id', `c.${titleId}`);
  const callBack = function() {
    if (this.status === 201) {
      const todo = JSON.parse(this.response).tasks;
      const totalTasks = todo
        .map(task => displayTodo(task.task, task.taskId, task.done))
        .join('\n');
      document.getElementById('todo').innerHTML = totalTasks;
    }
    button.onclick = taskRequest.bind(null, titleId);
  };
  newRequest('POST', 'loadTask', callBack, {titleId: titleId});
};

const displayTitle = function(id, title) {
  const div = document.createElement('div');
  div.classList.add('project');
  div.setAttribute('id', JSON.parse(id));
  div.innerText = title.value;
  title.value = '';
  document.getElementById('allTodos').appendChild(div);
};

const titleRequest = function() {
  const title = document.getElementById('titlePlace');
  const callBack = function() {
    if (this.status === 201) {
      displayTitle(this.response, title);
    }
  };
  newRequest('POST', 'saveTitle', callBack, {title: title.value});
};

const updateStatus = function() {
  const titleId = document
    .querySelector('.myTasks')
    .id.split('.')
    .pop();
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const getCheckBox = function() {
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkBox');
  checkBox.setAttribute('class', 'check');
  return checkBox;
};

const createDiv = () => document.createElement('div');
const createBlockElements = function() {
  const block = createDiv();
  const todo = createDiv();
  const eliminate = createDiv();
  const checkBox = getCheckBox();
  return [block, todo, eliminate, checkBox];
};

const createBlock = function(task, taskId) {
  const [block, todo, eliminate, checkBox] = createBlockElements();
  block.classList.add('display');
  block.setAttribute('id', taskId);
  todo.classList.add('heading');
  eliminate.classList.add('delete');
  block.appendChild(checkBox);
  block.appendChild(todo);
  block.appendChild(eliminate);
  todo.innerText = task.value;
  return block;
};

const taskRequest = function(titleId) {
  const [task, todoBlock] = ['task', 'todo'].map(id =>
    document.getElementById(id)
  );
  const callBack = function() {
    const taskId = JSON.parse(this.response);
    const block = createBlock(task, taskId);
    todoBlock.appendChild(block);
    task.value = '';
    document.querySelectorAll('.check').forEach(task => {
      task.onclick = updateStatus;
    });
    document.querySelectorAll('.delete').forEach(task => {
      task.innerHTML = '_';
      task.onclick = deleteTask.bind(null, titleId);
    });
  };

  newRequest('POST', 'saveTask', callBack, {
    task: task.value,
    titleId
  });
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
  document.querySelector('#saveTitle').addEventListener('click', titleRequest);
  document.querySelector('#allTodos').addEventListener('click', renderTodos);
  document.querySelector('#allTodos').addEventListener('dblclick', deleteTodo);
};

window.onload = attachClickEventListeners;
