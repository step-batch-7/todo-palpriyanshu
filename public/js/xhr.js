const appendChildToParent = parentChildList => {
  parentChildList.forEach(([parent, child]) => parent.appendChild(child));
};

const addClass = classList => {
  classList.forEach(([element, className]) => element.classList.add(className));
};

const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const displayTodo = function(todo, taskId, titleId) {
  return `
  <div class="display" id="${taskId}">
    <input type="checkBox" class="check" onClick="updateStatus()">
    <div class="heading">${todo}</div>
    <div class="delete" onClick="deleteTask(${titleId})"> _ </div>
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
        .map(task => displayTodo(task.task, task.taskId, titleId))
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

const updateStatus = function(titleId) {
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const getCheckBox = function() {
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkBox');
  checkBox.setAttribute('class', 'check');
  return checkBox;
};

const taskRequest = function(titleId) {
  const [task, todoBlock] = ['task', 'todo'].map(id =>
    document.getElementById(id)
  );
  // eslint-disable-next-line max-statements
  const callBack = function() {
    const [block, todo, eliminate] = ['div', 'div', 'div'].map(div =>
      document.createElement(div)
    );
    const checkBox = getCheckBox();

    const classElementPairs = [
      [block, 'display'],
      [todo, 'heading'],
      [eliminate, 'delete']
    ];
    addClass(classElementPairs);

    const taskId = JSON.parse(this.response);
    block.setAttribute('id', taskId);
    const parentChildList = [
      [block, checkBox],
      [block, todo],
      [block, eliminate],
      [todoBlock, block]
    ];
    appendChildToParent(parentChildList);
    todo.innerText = task.value;
    task.value = '';

    document.querySelectorAll('.check').forEach(task => {
      task.onclick = updateStatus.bind(null, titleId);
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
