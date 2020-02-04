const xhrRequest = function() {
  const req = new XMLHttpRequest();

  req.open('POST', '/template/todoPage.html');
  req.setRequestHeader('content-type', 'application/json');

  req.onload = function() {
    if (req.status === 201) {
      const textArea = document.createElement('div');
      textArea.classList.add('project');
      textArea.innerText = title;
      const index = document.getElementById('index');
      index.appendChild(textArea);
    }
  };

  const title = document.getElementById('titlePlace').value;
  req.send(`title=${title}`);
};
