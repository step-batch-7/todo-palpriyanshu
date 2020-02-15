const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {
  loginUser,
  signInUser,
  isUserLoggedIn,
  logoutUser,
  serveTodoPage,
  serveTodos,
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
} = require('./responses');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.post('/login', loginUser);
app.post('/signIn', signInUser);

app.use(isUserLoggedIn);
app.get('/logout', logoutUser);
app.get('/', (req, res) => res.redirect('/todo'));
app.get('/todo', serveTodoPage);
app.get('/serveTodos', serveTodos);
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

module.exports = {app};
