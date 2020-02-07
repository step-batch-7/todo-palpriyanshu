const matchRoute = function(route, req) {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }

  use(middleware) {
    this.routes.push({handler: middleware});
  }

  get(path, handler) {
    this.routes.push({path, handler, method: 'GET'});
  }

  post(path, handler) {
    this.routes.push({path, handler, method: 'POST'});
  }

  serveRequest(req, res) {
    const matchedHandlers = this.routes.filter(route => matchRoute(route, req));
    const next = function() {
      const router = matchedHandlers.shift();
      return router.handler(req, res, next);
    };
    return next();
  }
}

module.exports = App;
