import { v4 as uuidv4 } from "uuid";
import setCookieParser from "set-cookie-parser";

import { STATUS_CODE } from "types/status-code";

import { setupTest } from "tests/mocks/jest/setup-test";
import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

import orchestrator from "tests/orchestrator";

const PATH_URL = "/api/v1/register";

afterEach(() => {
  jest.clearAllMocks();
});

const { session, register } = setupTest({
  models: {
    "models/session": ["findOneValidByToken"],
    "models/register": ["create"],
  },
  spy: ["controller.setSessionCookie"],
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST '/api/v1/register' (controller unit)", () => {
  describe("Default user", () => {
    test("With valid session and create registration", async () => {
      const handler = require("pages/api/v1/register").default;

      const objectRegister = orchestrator.createRegisterObject();

      const mockSession = {
        token_protheus: uuidv4(),
        token: uuidv4(),
      };

      const mockResponse = {
        status_code: STATUS_CODE.CREATE,
        message: "Registro importado com sucesso",
      };

      session.findOneValidByToken.mockResolvedValue(mockSession);
      register.create.mockResolvedValue(mockResponse);

      const request = createRequest({
        method: "POST",
        url: PATH_URL,
        body: objectRegister,
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${mockSession.token}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(session.findOneValidByToken).toHaveBeenCalledWith(
        mockSession.token,
      );

      expect(register.create).toHaveBeenCalledWith(
        objectRegister,
        mockSession.token_protheus,
      );

      expect(response.status).toEqual(STATUS_CODE.CREATE);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        status_code: STATUS_CODE.CREATE,
        message: "Registro importado com sucesso",
      });

      // VALIDA CACHE NAVEGADOR ESTÁ DESATIVADO
      const cacheControl = response.getHeader("Cache-control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(
        response.getHeader("set-cookie"),
        {
          map: true,
        },
      );

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: process.env.COOKIE_NAME,
        value: mockSession.token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
