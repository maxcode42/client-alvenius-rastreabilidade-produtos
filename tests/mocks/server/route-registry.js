function createRouteRegistry() {
  const routes = new Map();

  function buildKey(method, path) {
    return `${method.toUpperCase()} ${path}`;
  }

  function on(method, path, handler) {
    routes.set(buildKey(method, path), handler);
  }

  function get(method, path) {
    return routes.get(buildKey(method, path));
  }

  function reset() {
    routes.clear();
  }

  function list() {
    return Array.from(routes.keys());
  }

  return { on, get, reset, list };
}

module.exports = { createRouteRegistry };
