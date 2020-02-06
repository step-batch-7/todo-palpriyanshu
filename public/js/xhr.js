const appendChildToParent = parentChildList => {
  parentChildList.forEach(([parent, child]) => parent.appendChild(child));
};

const addClass = classList => {
  classList.forEach(([element, className]) => element.classList.add(className));
};

const createElements = elementList => {
  return elementList.map(element => document.createElement(element));
};

const displayTodo = function(todo) {
  return `
  <div class="display">
    <input type="checkBox" class="check">
    <div class="heading">${todo}</div>
  </div>
`;
};

const renderTodos = function() {
  const button = document.getElementById('addButton');
  document.querySelector('.myTasks').classList.remove('hidden');
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
  const title = document.getElementById('titlePlace');
  const div = document.createElement('div');
  const titleId = `T_${new Date().getTime()}`;
  const callBack = function() {
    if (this.status === 201) {
      div.classList.add('project');
      div.id = titleId;
      div.innerText = title.value;
      title.value = '';
      document.getElementById('allTodos').appendChild(div);
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
  const task = document.getElementById('task');

  const callBack = function() {
    const [block, todo, checkBox] = createElements(['div', 'div', 'input']);
    const todoBlock = document.getElementById('todo');
    checkBox.setAttribute('type', 'checkBox');
    const classElementPairs = [
      [block, 'display'],
      [todo, 'heading'],
      [checkBox, 'check']
    ];
    addClass(classElementPairs);
    const parentChildList = [
      [block, checkBox],
      [block, todo],
      [todoBlock, block]
    ];
    appendChildToParent(parentChildList);
    todo.innerText = task.value;
    task.value = '';
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
  document.getElementById('fold').addEventListener('click', renderIndex);
  document.getElementById('saveTitle').addEventListener('click', titleRequest);
  document.getElementById('allTodos').addEventListener('click', renderTodos);
};

window.onload = attachClickEventListeners;
