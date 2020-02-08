const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const createDiv = () => document.createElement('div');

const htmlToElements = function(html) {
  const template = createDiv();
  template.innerHTML = html;
  return template.firstChild;
};

const displayTodo = function(todo, taskId, done) {
  let checked = '';
  if (done) {
    checked = 'checked';
  }
  return `
  <div class="display" id="${taskId}">
    <input type="checkBox" class="check" onClick="updateStatus()" ${checked}>
    <div class="heading">${todo}</div>
    <img src="../images/minus.png" class="titleImg delete" onClick="deleteTask()"/>
  </div>
  `;
};

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
  const myTasks = document.querySelector('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const getCheckBox = function() {
  const html = '<input type="checkBox" class="check" onClick="updateStatus()">';
  return htmlToElements(html);
};

const getMinusSign = function() {
  const minusSign = document.createElement('img');
  minusSign.setAttribute('onClick', 'deleteTask');
  minusSign.setAttribute('src', '../images/minus.png');
  minusSign.setAttribute('class', 'titleImg');
  minusSign.setAttribute('class', 'delete');
  return minusSign;
};

const createBlockElements = function() {
  const block = createDiv();
  const todo = createDiv();
  const checkBox = getCheckBox();
  const minusSign = getMinusSign();
  return {block, todo, minusSign, checkBox};
};

const createBlock = function(task, taskId) {
  const {block, todo, minusSign, checkBox} = createBlockElements();
  block.classList.add('display');
  block.setAttribute('id', taskId);
  todo.classList.add('heading');
  block.appendChild(checkBox);
  block.appendChild(todo);
  block.appendChild(minusSign);
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
      task.onclick = deleteTask;
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
