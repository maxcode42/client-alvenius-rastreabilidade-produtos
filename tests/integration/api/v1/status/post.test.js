import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

const PATH_URL = "/api/v1/status";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST '/api/v1/status'", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
      });

      expect(response.status).toBe(STATUS_CODE.NOT_ALLOWED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action:
          "Verifique se o método `HTTP` enviado é válido para esse endpoint",
        status_code: STATUS_CODE.NOT_ALLOWED,
      });
    });
  });
});
