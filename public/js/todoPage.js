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
