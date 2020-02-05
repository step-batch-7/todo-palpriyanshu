const appendChildToParent = parentChildList => {
  parentChildList.forEach(([parent, child]) => parent.appendChild(child));
};

const addClass = classList => {
  classList.forEach(([element, className]) => element.classList.add(className));
};

const createElements = elementList => {
  return elementList.map(element => document.createElement(element));
};

const renderItems = function() {
  const button = document.getElementById('addButton');
  const id = event.target.id;
  const itemBlock = document.getElementById('items');
  if (itemBlock.innerText) {
    itemBlock.innerText = '';
  }
  const callBack = function() {
    button.onclick = taskRequest.bind(null, id);
  };
  newRequest('POST', 'loadTask', callBack, `id=${id}`);
};

const titleRequest = function() {
  const title = document.getElementById('titlePlace');
  const textArea = document.createElement('div');
  const titleId = `T_${new Date().getTime()}`;
  const callBack = function() {
    if (this.status === 201) {
      textArea.onclick = renderItems;
      textArea.classList.add('project');
      textArea.id = titleId;
      textArea.innerText = title.value;
      title.value = '';
      const index = document.getElementById('index');
      index.appendChild(textArea);
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
    const [block, item, checkBox] = createElements(['div', 'div', 'input']);
    const itemBlock = document.getElementById('items');
    checkBox.setAttribute('type', 'checkBox');
    const classElementPairs = [
      [block, 'display'],
      [item, 'heading'],
      [checkBox, 'check']
    ];
    addClass(classElementPairs);
    const parentChildList = [
      [block, checkBox],
      [block, item],
      [itemBlock, block]
    ];
    appendChildToParent(parentChildList);
    item.innerText = task.value;
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

const hideIndex = function() {
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

const attachEventListeners = () => {
  document.getElementById('fold').addEventListener('click', hideIndex);
  document.getElementById('save').addEventListener('click', titleRequest);
};

window.onload = attachEventListeners;
