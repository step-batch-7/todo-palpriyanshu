const request = require('supertest');
const {truncateSync, readFileSync, writeFileSync} = require('fs');
const config = require('../config.js');

const STATUS_CODES = require('../lib/statusCodes.js');

const createSampleTODO = function() {
  const sampleContent = readFileSync(config.SAMPLE_TODO, 'utf8');
  writeFileSync(config.DATA_STORE, sampleContent, 'utf8');
};

createSampleTODO();

const app = require('../lib/handler.js');

after(() => {
  truncateSync(config.DATA_STORE);
});

describe('GET', function() {
  context('request for file that does not exist', function() {
    it('should respond with 404 notFound"', function(done) {
      request(app.serveRequest.bind(app))
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(STATUS_CODES.notFound, done);
    });
  });

  context('request for html file', function() {
    it('should respond with landingPage when url is "/"', function(done) {
      request(app.serveRequest.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect('content-type', /html/)
        .expect('content-length', '602')
        .expect(STATUS_CODES.ok, done);
    });

    it('should respond with landingPage when url is "/index.html"', function(done) {
      request(app.serveRequest.bind(app))
        .get('/index.html')
        .set('Accept', '*/*')
        .expect('content-type', /html/)
        .expect('content-length', '602')
        .expect(STATUS_CODES.ok, done);
    });

    it('should respond with todoPage when url is "/template/todoPage.html"', function(done) {
      request(app.serveRequest.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect('content-type', /html/)
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for css file', function() {
    it('should respond with styleSheet when url is "/css/style.css"', function(done) {
      request(app.serveRequest.bind(app))
        .get('/css/style.css')
        .set('Accept', '*/*')
        .expect('content-type', /css/)
        .expect('content-length', '1900')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for png file', function() {
    it('should respond with image when url is "/images/folder.png"', function(done) {
      request(app.serveRequest.bind(app))
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
    request(app.serveRequest.bind(app))
      .put('/index.html')
      .set('Accept', '*/*')
      .expect(STATUS_CODES.notFound, done);
  });
});

describe('POST', function() {
  context('request for saveTitle', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(app.serveRequest.bind(app))
        .post('/saveTitle')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({title: 'maths'}))
        .expect('content-length', '17')
        .expect(STATUS_CODES.create, done);
    });
  });

  context('request for saveTask', function() {
    it('should parse JSON & respond with 201 create', function(done) {
      request(app.serveRequest.bind(app))
        .post('/saveTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({task: 'shapes', titleId: 'T_1581166399023'}))
        .expect('content-length', '7')
        .expect(STATUS_CODES.create, done);
    });
  });

  context('request for loadTask', function() {
    it('should parse JSON & respond with 201', function(done) {
      request(app.serveRequest.bind(app))
        .post('/loadTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({titleId: 'T_1581166471934'}))
        .expect('content-length', '159')
        .expect(STATUS_CODES.create, done);
    });
  });

  context('request for deleteTask', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app.serveRequest.bind(app))
        .post('/deleteTask')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({titleId: 'T_1581166399023', taskId: 'T_639'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for deleteAllTodo', function() {
    it('should parse JSON & respond with 200', function(done) {
      request(app.serveRequest.bind(app))
        .post('/deleteAllTodo')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({titleId: 'T_1581166399023'}))
        .expect('content-length', '0')
        .expect(STATUS_CODES.ok, done);
    });
  });

  context('request for todoPage', function() {
    it('should parse queryString & respond with 303', function(done) {
      request(app.serveRequest.bind(app))
        .post('/template/todoPage.html')
        .set('Accept', '*/*')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send('userName: priyanshu')
        .expect('content-length', '0')
        .expect(STATUS_CODES.redirect, done)
        .expect('location', '/template/todoPage.html');
    });

    it('should respond with html after redirect', function(done) {
      request(app.serveRequest.bind(app))
        .get('/template/todoPage.html')
        .set('Accept', '*/*')
        .expect('Content-Type', /html/)
        .expect('content-length', '1808')
        .expect(STATUS_CODES.ok, done);
    });
  });
});
