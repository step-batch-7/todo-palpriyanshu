const App = require('./app.js');
const {
  readBody,
  parseBody,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  saveTodo,
  deleteTodo,
  saveTask,
  deleteTask,
  updateTaskStatus,
  loadTask,
  editTitle,
  editTask,
  filterTodo,
  notFound,
  methodNotAllowed
} = require('./responses.js');

const app = new App();

app.use(readBody);
app.use(parseBody);

app.get('/template/todoPage.html', serveTodoPage);
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('/template/todoPage.html', servePost);
app.post('saveTitle', saveTodo);
app.post('deleteAllTodo', deleteTodo);
app.post('saveTask', saveTask);
app.post('deleteTask', deleteTask);
app.post('updateTaskStatus', updateTaskStatus);
app.post('loadTask', loadTask);
app.post('editTitle', editTitle);
app.post('editTask', editTask);
app.post('filterTodo', filterTodo);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;
