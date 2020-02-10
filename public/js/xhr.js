const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const erase = selector => document.querySelector(selector).remove();

const htmlToElements = function(html) {
  const template = document.createElement('div');
  template.innerHTML = html;
  return template.firstElementChild;
};

// const createTodoCard = function() {
//   return `
//   <div class="hidden myTasks">
//     <div id="taskInput" class="display">
//       <input placeholder="add Task" type="text" id="task" required />
//       <img src="../images/plus.png" class="titleImg" id="addButton" />
//     </div>
//     <br />
//     <br />
//     <div id="todo"></div>
//   </div>`;
// };

const createBlock = function(task, taskId, hasChecked = '') {
  return `<div class="display" id="${taskId}">
  <input type="checkBox" class="check" onClick="updateStatus()" ${hasChecked}>
  <div class="heading">${task}</div>
  <img src="../images/minus.png" class="titleImg delete" onClick="deleteTask()">
  </div>`;
};

const createTodo = function(tasks) {
  return tasks
    .map(task => displayTodo(task.task, task.taskId, task.done))
    .join('\n');
};

const displayTodo = function(todo, taskId, done) {
  if (done) {
    return createBlock(todo, taskId, 'checked');
  }
  return createBlock(todo, taskId);
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
      const totalTasks = createTodo(todo);
      document.getElementById('todo').innerHTML = totalTasks;
    }
    button.onclick = taskRequest.bind(null, titleId);
  };
  newRequest('POST', 'loadTask', callBack, {titleId: titleId});
};

const displayTitle = function(id, title) {
  const html = `<div class="project" id="${JSON.parse(id)}"></div>`;
  const div = htmlToElements(html);
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

const taskRequest = function(titleId) {
  const [task, todoBlock] = ['task', 'todo'].map(id =>
    document.getElementById(id)
  );
  const callBack = function() {
    const taskId = JSON.parse(this.response);
    let block = createBlock(task.value, taskId);
    block = htmlToElements(block);
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

const filterTodo = function() {
  const searchValue = event.target.value;
  const callback = function() {
    const matchedValue = JSON.parse(this.response);
    const form = document.querySelector('#myAllTasks');
    form.innerHTML = '';
    console.log(matchedValue);
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
  document.querySelector('#saveTitle').addEventListener('click', titleRequest);
  document.querySelector('#allTodos').addEventListener('click', renderTodos);
  document.querySelector('#allTodos').addEventListener('dblclick', deleteTodo);
  document.querySelector('.searchBar').addEventListener('keyup', filterTodo);
};

window.onload = attachClickEventListeners;
