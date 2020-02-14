const {stdout} = require('process');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {
  serveTodoPage,
  serveLoginPage,
  loginUser,
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
} = require('./lib/responses');

const port = 4000;
const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/todo', serveTodoPage);
app.get('/login.html', serveLoginPage);
app.post('/login', loginUser);
app.get('/', (req, res) => res.redirect('/todo'));
app.get('', serveStaticFiles);
app.get('', notFound);

app.post('/saveTitle', saveTodo);
app.delete('/deleteAllTodo', deleteTodo);
app.post('/saveTask', saveTask);
app.delete('/deleteTask', deleteTask);
app.patch('/updateTaskStatus', updateTaskStatus);
app.post('/loadTask', loadTask);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);
app.post('/filterTodo', filterTodo);
app.post('', notFound);

app.use(methodNotAllowed);

const server = app.listen(port, () =>
  stdout.write(`server listening on ${port}\n`)
);

module.exports = server;
