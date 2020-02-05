const renderItems = function() {
  const button = document.getElementById('addButton');
  const id = event.target.id;
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

  // eslint-disable-next-line max-statements
  const callBack = function() {
    const textArea = document.getElementById('textArea');
    const block = document.createElement('div');
    block.classList.add('display');
    const item = document.createElement('div');
    item.classList.add('heading');
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkBox');
    checkBox.classList.add('check');
    block.appendChild(checkBox);
    block.appendChild(item);
    textArea.appendChild(block);
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
