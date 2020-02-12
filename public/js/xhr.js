const getElement = selector => document.querySelector(selector);

const hide = selector => getElement(selector).classList.add('hidden');

const show = selector => getElement(selector).classList.remove('hidden');

const erase = id => document.getElementById(id).remove();

const tasksAsHtml = function (tasks) {
  return tasks.map(({id, name, done}) => {
    return `<div class="display" id="${id}">
    <input type="checkBox" class="check" onclick="updateStatus()" ${done ? 'checked' : ''}>
    <div class="heading">${name}</div>
    <img src="../images/minus.png" class="titleImg minus" onclick="deleteTask()">
  </div>`;
  })
    .join('\n');
};

const todoBlockAsHtml = function (id, title, tasks) {
  return `
  <div class="myTasks" id="c.${id}">
    <div class="display">
      <span class="title" contenteditable="true" onblur="editTitle('${id}',this)"> ${title}</span>
      <div class="editIcon">
        <img src="../images/pencil.png" alt="image not found"/>
      </div>
    </div>
    <div id="taskInput" class="display">
      <input placeholder="add Task" type="text" id="task" required />
      <img src="../images/plus.png" class="titleImg" id="addButton" onclick = "addNewTask('${id}')"/>
    </div>
    <br />
    <br />
    <div id="todo">${tasksAsHtml(tasks)} </div>
  </div>`;
};

const displayTodo = function (todoId) {
  const callBack = function () {
    if (this.status === 201) {
      const {id, title, tasks} = JSON.parse(this.response);
      const myAllTasks = getElement('#myAllTasks');
      myAllTasks.innerHTML = todoBlockAsHtml(id, title, tasks);
    }
  };
  newRequest('POST', 'loadTask', callBack, {todoId});
};

const addToTodoList = function ({id, title}) {
  const todoLists = getElement('#allTodos');
  const html = `<div class="project" id="${id}" onclick="displayTodo('${id}')">
     ${title} 
     </div>`;
  todoLists.innerHTML += html;
};

const createTodo = function () {
  const textBox = getElement('#titlePlace');
  const title = textBox.value;
  textBox.value = '';
  const callBack = function () {
    if (this.status === 201) {
      addToTodoList(JSON.parse(this.response));
    }
  };
  newRequest('POST', 'saveTitle', callBack, {title});
};

const deleteTodo = function (todoId) {
  const callBack = () => {
    getElement('#todo').innerText = '';
    hide('.myTasks');
    erase(`${todoId}`);
  };
  newRequest('POST', 'deleteAllTodo', callBack, {todoId});
  hide('.dialogBox');
};

const showDeleteDialogBox = function () {
  const id = event.target.id;
  show('.dialogBox');
  getElement('.delete').setAttribute('onclick', `deleteTodo('${id}')`);
  getElement('.cancel').setAttribute('onclick', 'hide(".dialogBox")');
};

const addNewTask = function (titleId) {
  const todoBlock = getElement('#todo');
  const textBox = getElement('#task');
  const name = textBox.value;
  textBox.value = '';
  const callBack = function () {
    const task = JSON.parse(this.response);
    todoBlock.innerHTML += tasksAsHtml(task);
  };

  newRequest('POST', 'saveTask', callBack, {name, titleId});
};

const deleteTask = function () {
  const myTasks = getElement('.myTasks');
  const todoId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  const callBack = () => erase(`${taskId}`);
  newRequest('POST', 'deleteTask', callBack, {todoId, taskId});
};

const updateStatus = function () {
  const myTasks = getElement('.myTasks');
  const titleId = myTasks.id.split('.').pop();
  const taskId = event.target.parentElement.id;
  newRequest('POST', 'updateTaskStatus', true, {titleId, taskId});
};

const editTitle = function (todoId, titleDivision) {
  const callBack = function () {
    const newTitle = JSON.parse(this.response);
    const title = getElement('.title');
    const todo = getElement(`#${todoId}`);
    title.innerText = newTitle;
    todo.innerText = newTitle;
  };
  const title = titleDivision.innerText;
  newRequest('POST', 'editTitle', callBack, {todoId, title});
};

const filterTodo = function () {
  const searchValue = event.target.value;
  const callback = function () {
    const matchedValue = JSON.parse(this.response);
    console.log(this.response);
    const form = getElement('#myAllTasks');
    form.innerHTML = '';
  };
  newRequest('POST', 'filterTodo', callback, {searchValue});
};

const newRequest = function (method, url, callBack, reqMsg) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('content-type', 'application/json');
  req.onload = callBack;
  req.send(JSON.stringify(reqMsg));
};

const renderIndex = function () {
  const index = getElement('#index');
  index.classList.toggle('hidden');
};

const attachClickEventListeners = () => {
  getElement('#fold').addEventListener('click', renderIndex);
  getElement('#saveTitle').addEventListener('click', createTodo);
  getElement('#allTodos').addEventListener('dblclick', showDeleteDialogBox);
  getElement('.searchBar').addEventListener('keyup', filterTodo);
};

window.onload = attachClickEventListeners;
