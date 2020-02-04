const App = require('./app.js');
const {
  readBody,
  saveTitle,
  saveTask,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
} = require('./responses.js');

const app = new App();

app.use(readBody);

app.get('/template/todoPage.html', serveTodoPage);
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('saveTask', saveTask);
app.post('saveTitle', saveTitle);
app.post('/template/todoPage.html', servePost);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;
