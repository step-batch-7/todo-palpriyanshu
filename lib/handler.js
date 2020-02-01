const App = require('./app.js');
const {
  serveStaticFiles,
  notFound,
  methodNotAllowed,
} = require('./responses.js');

const app = new App();

app.get('', serveStaticFiles);
app.get('', notFound);

app.post('', notFound);

app.use(methodNotAllowed);

module.exports = app;

