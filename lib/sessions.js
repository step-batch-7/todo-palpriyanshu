const generateSessionId = () => `SID_${new Date().getTime()}`;

class Sessions {
  constructor() {
    this.sessions = {};
  }
  createSession(username) {
    const sessionId = generateSessionId();
    this.sessions[sessionId] = username;
    return sessionId;
  }
  getUsername(sessionId) {
    return this.sessions[sessionId];
  }
}

module.exports = {Sessions};
