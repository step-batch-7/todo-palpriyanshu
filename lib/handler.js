const App = require('./app.js');
const {
  readBody,
  formatTodoDetails,
  saveTitle,
  saveTask,
  loadTask,
  filterTodo,
  updateTaskStatus,
  deleteAllTodo,
  deleteTask,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
} = require('./responses.js');

const app = new App();

app.use(readBody);
app.use(formatTodoDetails);

app.get('/template/todoPage.html', serveTodoPage);
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('saveTask', saveTask);
app.post('loadTask', loadTask);
app.post('filterTodo', filterTodo);
app.post('updateTaskStatus', updateTaskStatus);
app.post('deleteTask', deleteTask);
app.post('deleteAllTodo', deleteAllTodo);
app.post('saveTitle', saveTitle);
app.post('/template/todoPage.html', servePost);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;
