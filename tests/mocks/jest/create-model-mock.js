export function createModelMock(methods = []) {
  const mock = {};

  methods.forEach((method) => {
    mock[method] = jest.fn();
  });

  return mock;
}
