function setupModuleMocks(mocks) {
  Object.entries(mocks).forEach(([modulePath, factory]) => {
    jest.mock(modulePath, () => factory);
  });
}

module.exports = { setupModuleMocks };
