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

const displayTodo = function(todo) {
  return `
  <div class="display">
    <input type="checkBox" class="check">
    <div class="heading">${todo}</div>
    <div class="delete"> _ </div>
    </div>
    `;
};

const askToDelete = function(id) {
  if (event.target.classList[0] === 'yes') {
    const callBack = function() {
      hide('.myTasks');
    };
    newRequest('POST', 'deleteTask', callBack, `titleId=${id}`);
  }
  hide('.dialogBox');
};

const deleteTodo = function() {
  const id = event.target.id;
  show('.dialogBox');
  document.querySelector('.dialogBox').onclick = askToDelete.bind(null, id);
};

const renderTodos = function() {
  const button = document.getElementById('addButton');
  show('.myTasks');
  const id = event.target.id;
  document.querySelector('.myTasks').id = `c.${id}`;
  const callBack = function() {
    if (this.status === 201) {
      const todo = JSON.parse(this.response).tasks;
      const totalTasks = todo.map(task => displayTodo(task)).join('\n');
      document.getElementById('todo').innerHTML = totalTasks;
    }
    button.onclick = taskRequest.bind(null, id);
  };
  newRequest('POST', 'loadTask', callBack, `titleId=${id}`);
};

const titleRequest = function() {
  const [title, allTodos] = getElements(['#titlePlace', '#allTodos']);
  const div = document.createElement('div');
  const titleId = `T_${new Date().getTime()}`;
  const callBack = function() {
    if (this.status === 201) {
      div.classList.add('project');
      div.id = titleId;
      div.innerText = title.value;
      title.value = '';
      allTodos.appendChild(div);
    }
  };
  newRequest(
    'POST',
    'saveTitle',
    callBack,
    `title=${title.value}&id=${titleId}`
  );
};

const taskRequest = function(id) {
  const [task, todoBlock] = getElements(['#task', '#todo']);

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
    const taskList = document.querySelectorAll('.delete');
    taskList[taskList.length - 1].innerHTML = '_';
  };

  newRequest('POST', 'saveTask', callBack, `task=${task.value}&titleId=${id}`);
};

const newRequest = function(method, url, callBack, reqMsg) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(reqMsg);
};

const renderIndex = function() {
  const index = document.getElementById('index');
  index.classList.toggle('index');
  if (index.className !== 'index') {
    index.style.display = 'none';
    document.getElementById('textArea').style.width = '1370px';
    return;
  }
  document.getElementById('textArea').style.width = '1170px';
  index.style.display = 'block';
};

const attachClickEventListeners = () => {
  document.querySelector('#fold').addEventListener('click', renderIndex);
  document.querySelector('#saveTitle').addEventListener('click', titleRequest);
  document.querySelector('#allTodos').addEventListener('click', renderTodos);
  document.querySelector('#allTodos').addEventListener('dblclick', deleteTodo);
};

window.onload = attachClickEventListeners;
