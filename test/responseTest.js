const request = require('supertest');
const {truncateSync} = require('fs');
const config = require('../config.js');

const app = require('../lib/handler.js');
const STATUS_CODES = require('../lib/statusCodes.js');

describe('GET', function() {
  context('request for file that does not exist', function() {
    it('should respond with landingPage when url is "/"', function(done) {
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
  afterEach(() => {
    truncateSync(config.DATA_STORE);
  });
  context('request for saveTitle', function() {
    it('should parse JSON & respond with "created"', function(done) {
      request(app.serveRequest.bind(app))
        .post('/template/saveTitle')
        .set('Accept', '*/*')
        .set('content-type', 'application/json')
        .send(JSON.stringify({title: 'maths'}))
        .expect('content-length', '17')
        .expect(STATUS_CODES.create, done);
    });
  });
});
