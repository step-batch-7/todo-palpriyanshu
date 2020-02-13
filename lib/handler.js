const App = require('./app.js');
const {
  readBody,
  parseBody,
  serveTodoPage,
  serveLoginPage,
  serveStaticFiles,
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

const hasFields = (...fields) => {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      next();
    }
    res.statusCode = 400;
    res.end('bad request');
  }
}

app.use(readBody);
app.use(parseBody);

app.get('/template/todoPage.html', serveTodoPage);
app.get('/login.html',serveLoginPage);
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('saveTitle', hasFields("title"), saveTodo);
app.delete('deleteAllTodo', hasFields("todoId"), deleteTodo);
app.post('saveTask', hasFields("todoId", "name"), saveTask);
app.delete('deleteTask', hasFields("todoId", "taskId"), deleteTask);
app.patch('updateTaskStatus', hasFields("titleId", "taskId"), updateTaskStatus);
app.post('loadTask', hasFields("todoId"), loadTask);
app.post('editTitle', hasFields("todoId", "title"), editTitle);
app.post('editTask', hasFields("todoId", "taskId", "name"), editTask);
app.post('filterTodo', hasFields("searchValue"), filterTodo);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;
