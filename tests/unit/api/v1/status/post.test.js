import handler from "pages/api/v1/status";

import { STATUS_CODE } from "types/status-code";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

jest.mock("infra/database");
jest.mock("infra/provider/api-protheus");
jest.spyOn(console, "error").mockImplementation(() => {});

const PATH_URL = "/api/v1/status";

describe("POST '/api/v1/status' (controller unit)", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const request = createRequest({
        method: "POST",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

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
