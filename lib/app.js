const matchRoute = function (route, req) {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }

  insertIntoRouteChain(method, path, handlers) {
    const routes = handlers.map(handler => ({ path, handler, method }))
    this.routes.push(...routes);
  }

  use(...middleware) {
    this.insertIntoRouteChain(null, null, middleware);
  }

  get(path, ...handlers) {
    this.insertIntoRouteChain('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.insertIntoRouteChain('POST', path, handlers);
  }

  delete(path, ...handlers) {
    this.insertIntoRouteChain('DELETE', path, handlers);
  }

  patch(path, ...handlers) {
    this.insertIntoRouteChain('PATCH', path, handlers);
  }

  serveRequest(req, res) {
    const matchedHandlers = this.routes.filter(route => matchRoute(route, req));
    const next = function () {
      const router = matchedHandlers.shift();
      return router.handler(req, res, next);
    };
    return next();
  }
}

module.exports = App;
