const assert = require('chai').assert;
const sinon = require('sinon');

const {SessionManager} = require('../lib/sessionManager');

describe('* class SessionManager', function() {
  describe('createSession', function() {
    it('should create session when username is given', function() {
      const date = new Date(123456);
      const fakeTime = sinon.useFakeTimers(date.getTime());
      const sessionId = `SID_${fakeTime.now}`;
      const sessionManager = new SessionManager();
      const actual = sessionManager.createSession('newUserName');
      assert.strictEqual(actual, sessionId);
    });
  });

  describe('deleteSession', function() {
    it('should delete session when sessionId is given', function() {
      const sessionManager = new SessionManager();
      const sessionId = sessionManager.createSession('newUserName');
      sessionManager.deleteSession(sessionId);
      assert.isUndefined(sessionManager[sessionId]);
    });
  });

  describe('getUserName', function() {
    it('should give username when sessionId is given', function() {
      const sessionManager = new SessionManager();
      const sessionId = sessionManager.createSession('newUserName');
      assert.strictEqual(sessionManager.getUsername(sessionId), 'newUserName');
    });
  });
});
