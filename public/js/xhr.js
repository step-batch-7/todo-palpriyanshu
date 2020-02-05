const appendChildToParent = function(parentChildList) {
  parentChildList.forEach(([parent, child]) => parent.appendChild(child));
};

const addClass = function(classList) {
  classList.forEach(([element, className]) => element.classList.add(className));
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
  const title = document.getElementById('titlePlace').value;
  const textArea = document.createElement('div');
  const titleId = `T_${new Date().getTime()}`;
  const callBack = function() {
    if (this.status === 201) {
      textArea.onclick = renderItems;
      textArea.classList.add('project');
      textArea.id = titleId;
      textArea.innerText = title;
      const index = document.getElementById('index');
      index.appendChild(textArea);
    }
  };
  newRequest('POST', 'saveTitle', callBack, `title=${title}&id=${titleId}`);
};

const taskRequest = function(id) {
  const task = document.getElementById('task').value;

  const callBack = function() {
    const block = document.createElement('div');
    const item = document.createElement('div');
    const checkBox = document.createElement('input');
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
    item.innerText = task;
  };

  newRequest('POST', 'saveTask', callBack, `task=${task}&titleId=${id}`);
};

const newRequest = function(method, url, callBack, reqMsg) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(reqMsg);
};
