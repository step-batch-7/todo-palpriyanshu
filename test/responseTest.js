const request = require('supertest');
const {truncateSync, readFileSync, writeFileSync} = require('fs');
const config = require('../config.js');

const STATUS_CODES = require('../lib/statusCodes.js');

const createSampleTODO = function() {
  const sampleContent = readFileSync(config.SAMPLE_TODO, 'utf8');
  writeFileSync(config.DATA_STORE, sampleContent, 'utf8');
};

const server = require('../server');

after(() => server.close());

describe('GET', function() {
  context('request for file that does not exist', function() {
    it('should respond with 404 notFound"', function(done) {
      request(server)
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(STATUS_CODES.notFound, done);
    });
  });

  context('request for html file', function() {
    it('should redirect to todoPage when url is "/" and user is not logged in', function(done) {
      request(server)
        .get('/')
        .set('Accept', '*/*')
        .expect('location', '/todo')
        .expect(STATUS_CODES.redirect, done);
    });

    it('should respond with login page when url is "/login.html"', function(done) {
      request(server)
        .get('/login.html')
        .set('Accept', '*/*')
        .expect('content-type', /html/)
        .expect('content-length', '949')
        .expect(STATUS_CODES.ok, done);
    });

    it('should redirect to login page when url is "/template/todoPage.html" and user is not logged in', function(done) {
      request(server)
        .get('/todo')
        .set('Accept', '*/*')
        .expect('location', '/login.html')
        .expect(STATUS_CODES.redirect, done);
    });
  });

  context('request for css file', function() {
    it('should respond with styleSheet when url is "/css/style.css"', function(done) {
      request(server)
        .get('/css/style.css')
        .set('Accept', '*/*')
        .expect('content-type', /css/)
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for png file', function() {
    it('should respond with image when url is "/images/folder.png"', function(done) {
      request(server)
        .get('/images/folder.png')
        .set('Accept', '*/*')
        .expect('content-type', /png/)
        .expect('content-length', '4616')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('PUT', function() {
  it('should respond with 404 when method is not allowed', function(done) {
    request(server)
      .put('/index.html')
      .set('Accept', '*/*')
      .expect(STATUS_CODES.notFound, done);
  });
});

describe('POST', function() {
  beforeEach(() => createSampleTODO());
  afterEach(() => {
    truncateSync(config.DATA_STORE);
  });
  context('request for loadTask', function() {
    it('should parse JSON & respond with 201', function(done) {
      request(server)
        .post('/loadTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({todoId: 'T_1581166471934'}))
        .expect('content-length', '148')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for saveTitle', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/saveTitle')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({title: 'maths'}))
        .expect('content-length', '40')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for editTitle', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/editTitle')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({todoId: 'T_1581166471934', title: 'rasogullas'}))
        .expect('content-length', '12')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for editTask', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/editTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(
          JSON.stringify({
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
    it('should filter by titleName & parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({searchValue: 'Food'}))
        .expect('content-length', '194')
        .expect(STATUS_CODES.ok, done);
    });

    it('should filter by taskName & parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({searchValue: 'Maths'}))
        .expect('content-length', '98')
        .expect(STATUS_CODES.ok, done);
    });

    it('should return no content when searchText is not matched with anyone', function(done) {
      request(server)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({searchValue: 'Science'}))
        .expect('content-length', '2')
        .expect(STATUS_CODES.ok, done);
    });

    it('should return empty array when searchText is empty String', function(done) {
      request(server)
        .post('/filterTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({searchValue: ''}))
        .expect('content-length', '2')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for saveTask', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(server)
        .post('/saveTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({name: 'shapes', todoId: 'T_1581166399023'}))
        .expect('content-length', '53')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('PATCH', function() {
  before(() => createSampleTODO());
  after(() => {
    truncateSync(config.DATA_STORE);
  });
  context('request for updateTaskStatus', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(server)
        .patch('/updateTaskStatus')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({titleId: 'T_1581166399023', taskId: 'T_639'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });
});

describe('DELETE', function() {
  beforeEach(() => createSampleTODO());
  afterEach(() => {
    truncateSync(config.DATA_STORE);
  });
  context('request for deleteTask', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(server)
        .delete('/deleteTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({todoId: 'T_1581166399023', taskId: 'T_639'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for deleteAllTodo', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(server)
        .delete('/deleteAllTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({todoId: 'T_1581166399023'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });
});
