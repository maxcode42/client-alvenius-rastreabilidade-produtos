import { v4 as uuidv4 } from "uuid";
import setCookieParser from "set-cookie-parser";

import { InternalServerError, UnauthorizedError } from "infra/errors";
import { STATUS_CODE } from "types/status-code";

import { setupTest } from "tests/mocks/jest/setup-test";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";
import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";

const PATH_URL = "/api/v1/boilermaking";
const COOKIE_NAME = process.env.COOKIE_NAME;

jest.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

const { session, boilermaking } = setupTest({
  models: {
    "models/boilermaking": ["findAll"],
    "models/session": ["findOneValidByToken"],
  },
  spy: ["controller.setSessionCookie"],
});

describe("GET '/api/v1/boilermaking' (controller unit)", () => {
  let handler;

  beforeAll(() => {
    handler = require("pages/api/v1/boilermaking").default;
  });
  describe("Default user", () => {
    test("With valid session and return list", async () => {
      const expiresAtMock = new Date(
        Date.now() + session.EXPIRATION_IN_MILLISECONDS,
      );

      const mockSession = {
        token_protheus: uuidv4(),
        token: uuidv4(),
        id: uuidv4(),
      };

      const mockResponseSession = {
        id: uuidv4(),
        token: uuidv4(),
        token_protheus: mockSession.token_protheus,
        user_id: mockSession.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: expiresAtMock.toISOString(),
      };

      const responseMock = {};

      session.findOneValidByToken.mockResolvedValue(mockResponseSession);

      boilermaking.findAll.mockResolvedValue(responseMock);

      const request = createRequest({
        path: PATH_URL,
        method: "GET",
        headers: {
          Cookie: `${COOKIE_NAME}=${mockResponseSession.token}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      const responseBody = await response.json();

      expect(session.findOneValidByToken).toHaveBeenCalledWith(
        mockResponseSession.token,
      );
      expect(boilermaking.findAll).toHaveBeenCalledWith(
        mockResponseSession.token_protheus,
      );

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      expect(typeof responseBody).toBe("object");
      expect(responseBody).toEqual(responseMock);

      // VALIDA CACHE NAVEGADOR ESTÁ DESATIVADO
      const cacheControl = response.headers.get("Cache-control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: COOKIE_NAME,
        value: mockResponseSession.token,
        httpOnly: true,
        path: "/",
      });
    });
    test("With unexpected error on findAll", async () => {
      const mockSession = {
        id: uuidv4(),
        token: uuidv4(),
        token_protheus: uuidv4(),
      };

      session.findOneValidByToken.mockResolvedValue(mockSession);
      boilermaking.findAll.mockRejectedValue(
        new InternalServerError({
          action: "Entre em contato com suporte.",
          message: "Um error interno inesperado ocorreu.",
        }),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "GET",
        headers: {
          Cookie: `${COOKIE_NAME}=${mockSession.token}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(session.findOneValidByToken).toHaveBeenCalledWith(
        mockSession.token,
      );
      expect(boilermaking.findAll).toHaveBeenCalledWith(
        mockSession.token_protheus,
      );

      expect(response.status).toBe(STATUS_CODE.SERVER_ERROR);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "InternalServerError",
        action: "Entre em contato com suporte.",
        message: "Um error interno inesperado ocorreu.",
        status_code: STATUS_CODE.SERVER_ERROR,
      });
    });
    test("With nonexistent session", async () => {
      const nonexistent = uuidv4();

      const mockResponseUnauthorized = {
        name: "UnauthorizedError",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        message: "Usuário não possui uma sessão ativa.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      };

      session.findOneValidByToken.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "GET",
        headers: {
          Cookie: `${COOKIE_NAME}=${nonexistent}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(session.findOneValidByToken).toHaveBeenCalledWith(nonexistent);
      expect(boilermaking.findAll).not.toHaveBeenCalled();

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
  });
});
