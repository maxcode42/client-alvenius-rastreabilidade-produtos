import { createModelMock } from "./create-model-mock";
import { setupControllerSpy } from "./spy-controller";

export function setupTest(config) {
  const mocks = {};

  if (config.models) {
    Object.entries(config.models).forEach(([path, methods]) => {
      const mock = createModelMock(methods);

      jest.doMock(path, () => mock);

      // adiciona no map geral
      mocks[path] = mock;

      // cria alias amigável (sessionMock, registerMock etc)
      // const alias = path.split("/").pop() + "Mock";
      const alias = path.split("/").pop();
      mocks[alias] = mock;
    });
  }

  const spies = {};

  if (config.spy?.includes("controller.setSessionCookie")) {
    const sessionModel = require("models/session");
    spies.setSessionCookie = setupControllerSpy(sessionModel);
  }

  return {
    mocks,
    ...mocks, // 🔥 expõe direto também
    spies,
  };
}
