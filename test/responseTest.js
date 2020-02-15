const request = require('supertest');
const sinon = require('sinon');
const {truncateSync} = require('fs');
const config = require('../config.js');
const {sessionManager} = require('../lib/responses');

const STATUS_CODES = require('../lib/statusCodes.js');

const {app} = require('../lib/app');

after(() => {
  truncateSync(config.DATA_STORE);
  sinon.restore();
});

before(() => {
  const createSessionStub = username => {
    if (username == 'kumar') return 'kumar';
    return '';
  };
  const getUsernameStub = sessionId => {
    if (sessionId == 'SID_123') return 'kumar';
    return '';
  };
  sinon.replace(sessionManager, 'createSession', createSessionStub);
  sinon.replace(sessionManager, 'getUsername', getUsernameStub);
});

describe('GET', function() {
  context('request for file that does not exist', function() {
    it('should respond with 404 notFound"', function(done) {
      request(app)
        .get('/badFile')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .expect(STATUS_CODES.notFound, done);
    });
  });

  context('request for html file', function() {
    it('should redirect to todoPage when url is "/" and user is not logged in', function(done) {
      request(app)
        .get('/')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .expect('location', '/todo')
        .expect(STATUS_CODES.redirect, done);
    });

    it('should respond with login page when url is "/login.html"', function(done) {
      request(app)
        .get('/login.html')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .expect('content-type', /html/)
        .expect('content-length', '949')
        .expect(STATUS_CODES.ok, done);
    });

    it('should redirect to login page when url is "/template/todoPage.html" and user is not logged in', function(done) {
      request(app)
        .get('/todo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_12')
        .send(JSON.stringify({username: 'santhosh'}))
        .expect('location', '/login.html')
        .expect(STATUS_CODES.redirect, done);
    });
  });

  context('request for css file', function() {
    it('should respond with styleSheet when url is "/css/style.css"', function(done) {
      request(app)
        .get('/css/style.css')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .expect('content-type', /css/)
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for png file', function() {
    it('should respond with image when url is "/images/folder.png"', function(done) {
      request(app)
        .get('/images/folder.png')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .expect('content-type', /png/)
        .expect('content-length', '4616')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('PUT', function() {
  it('should respond with 404 when method is not allowed', function(done) {
    request(app)
      .put('/index.html')
      .set('Accept', '*/*')
      .set('Cookie', 'sessionId=SID_123')
      .expect(STATUS_CODES.notFound, done);
  });
});

describe('POST', function() {
  context('request for loadTask', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app)
        .post('/loadTask')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', todoId: 'T_1581166471934'}))
        .expect('content-length', '148')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for saveTitle', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app)
        .post('/saveTitle')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', title: 'maths'}))
        .expect('content-length', '40')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for editTitle', function() {
    it('should edit title of given todo', function(done) {
      request(app)
        .post('/editTitle')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
            username: 'kumar',
            todoId: 'T_1581166471934',
            title: 'rasogullas'
          })
        )
        .expect('content-length', '12')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for editTask', function() {
    it('should edit the task of the given todo', function(done) {
      request(app)
        .post('/editTask')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
            username: 'kumar',
            todoId: 'T_1581166399023',
            taskId: 'T_639',
            name: 'apple'
          })
        )
        .expect('content-length', '7')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for filterTodo', function() {
    it('should filter by titleName & parse JSON & respond with 200', function(done) {
      request(app)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', searchValue: 'games'}))
        .expect('content-length', '146')
        .expect(STATUS_CODES.ok, done);
    });

    it('should filter by taskName & parse JSON & respond with 200', function(done) {
      request(app)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', searchValue: 'cricket'}))
        .expect('content-length', '97')
        .expect(STATUS_CODES.ok, done);
    });

    it('should return no content when searchText is not matched with anyone', function(done) {
      request(app)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', searchValue: 'Science'}))
        .expect('content-length', '2')
        .expect(STATUS_CODES.ok, done);
    });

    it('should return empty array when searchText is empty String', function(done) {
      request(app)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({username: 'kumar', searchValue: ''}))
        .expect('content-length', '2')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for saveTask', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(app)
        .post('/saveTask')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
            username: 'kumar',
            name: 'shapes',
            todoId: 'T_1581166399023'
          })
        )
        .expect('content-length', '53')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('PATCH', function() {
  context('request for updateTaskStatus', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app)
        .patch('/updateTaskStatus')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
            username: 'kumar',
            titleId: 'T_1581166399023',
            taskId: 'T_639'
          })
        )
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('DELETE', function() {
  context('request for deleteTask', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app)
        .delete('/deleteTask')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
            username: 'kumar',
            todoId: 'T_1581166399023',
            taskId: 'T_639'
          })
        )
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for deleteAllTodo', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app)
        .delete('/deleteAllTodo')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=SID_123')
        .set('content-type', 'application/json')
        .send(JSON.stringify({todoId: 'T_1581166399023'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });
});
