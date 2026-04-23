const registry = {};

export function registerMock(path, mock) {
  registry[path] = mock;
  return mock;
}

export function getMock(path) {
  return registry[path];
}
