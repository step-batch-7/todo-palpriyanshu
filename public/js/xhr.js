const appendChildToParent = parentChildList => {
  parentChildList.forEach(([parent, child]) => parent.appendChild(child));
};

const addClass = classList => {
  classList.forEach(([element, className]) => element.classList.add(className));
};

const createElements = elementList => {
  return elementList.map(element => document.createElement(element));
};

const getElements = selectorList => {
  return selectorList.map(selector => document.querySelector(selector));
};

const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const displayTodo = function(todo, id) {
  return `
  <div class="display" id="${id}">
    <input type="checkBox" class="check">
    <div class="heading">${todo}</div>
    <div class="delete" onClick="deleteTask"> _ </div>
  </div>
  `;
};

const askToDelete = function(titleId) {
  if (event.target.classList[0] === 'yes') {
    const callBack = () => erase('.myTasks');
    newRequest('POST', 'deleteAllTodo', callBack, {titleId});
  }
  hide('.dialogBox');
};

const deleteTodo = function() {
  const id = event.target.id;
  show('.dialogBox');
  document.querySelector('.dialogBox').onclick = askToDelete.bind(null, id);
};

const deleteTask = function(titleId) {
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`#${taskId}`);
  newRequest('POST', 'deleteTask', callBack, {titleId, taskId});
};

const renderTodos = function() {
  const button = document.getElementById('addButton');
  show('.myTasks');
  const id = event.target.id;
  document.querySelector('.myTasks').id = `c.${id}`;
  const callBack = function() {
    if (this.status === 201) {
      const todo = JSON.parse(this.response).tasks;
      const totalTasks = todo
        .map(task => displayTodo(task.task, task.taskId))
        .join('\n');
      document.getElementById('todo').innerHTML = totalTasks;
    }
    button.onclick = taskRequest.bind(null, id);
  };
  newRequest('POST', 'loadTask', callBack, {titleId: id});
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

const taskRequest = function(titleId) {
  const [task, todoBlock] = getElements(['#task', '#todo']);

  // eslint-disable-next-line max-statements
  const callBack = function() {
    const [block, todo, checkBox, eliminate] = createElements([
      'div',
      'div',
      'input',
      'div'
    ]);
    checkBox.setAttribute('type', 'checkBox');
    const classElementPairs = [
      [block, 'display'],
      [todo, 'heading'],
      [checkBox, 'check'],
      [eliminate, 'delete']
    ];

    const taskId = JSON.parse(this.response);
    block.setAttribute('id', taskId);
    addClass(classElementPairs);
    const parentChildList = [
      [block, checkBox],
      [block, todo],
      [block, eliminate],
      [todoBlock, block]
    ];
    appendChildToParent(parentChildList);
    todo.innerText = task.value;
    task.value = '';
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
