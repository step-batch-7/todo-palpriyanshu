const App = require('./app.js');
const {
  saveTitle,
  serveTodoPage,
  serveStaticFiles,
  servePost,
  notFound,
  methodNotAllowed
} = require('./responses.js');

const app = new App();

app.get('/template/todoPage.html', serveTodoPage);
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('saveTask', saveTitle);
app.post('saveTitle', saveTitle);
app.post('/template/todoPage.html', servePost);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;
