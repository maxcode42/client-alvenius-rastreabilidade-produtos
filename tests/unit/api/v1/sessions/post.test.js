import { version as uuidVersion, v4 as uuidv4 } from "uuid";
import setCookieParser from "set-cookie-parser";

import { UnauthorizedError } from "infra/errors";
import { STATUS_CODE } from "types/status-code";

import { setupTest } from "tests/mocks/jest/setup-test";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";
import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";

const PATH_URL = "/api/v1/sessions";
const COOKIE_NAME = process.env.COOKIE_NAME;

// jest.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

const { session, authentication } = setupTest({
  models: {
    "models/authentication": ["getAuthenticateUser"],
    "models/session": ["create"],
  },
  spy: ["controller.setSessionCookie"],
  // database: true,
});

const mockResponseUnauthorized = {
  name: "UnauthorizedError",
  message: "Dados de autenticação não conferem.",
  action: "Verifique se os dados enviados estão corretos.",
  status_code: STATUS_CODE.UNAUTHORIZED,
};

describe("POST '/api/v1/sessions' (controller unit)", () => {
  let handler;

  beforeAll(() => {
    handler = require("pages/api/v1/sessions").default;
  });
  describe("Anonymous user", () => {
    test("With incorrect `username` and incorrect `password`", async () => {
      const objectUser = {
        username: "user and password incorrect",
        password: "senhaTest123Incorrect",
      };

      authentication.getAuthenticateUser.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "POST",
        body: {
          username: objectUser.username,
          password: objectUser.password,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
    test("With incorrect `username` but correct `password`", async () => {
      const objectUser = {
        username: "new user incorrect",
        password: "senhaTest123",
      };

      authentication.getAuthenticateUser.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "POST",
        object: {
          username: "incorrect username",
          password: objectUser.password,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
    test("With correct `username` but incorrect `password`", async () => {
      const objectUser = {
        username: "new user correct",
        password: "senhaTest123Incorrect",
      };

      authentication.getAuthenticateUser.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "POST",
        object: {
          username: objectUser.username,
          password: "incorrect password",
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
    test("With correct `username` and correct `password`", async () => {
      const expiresAtMock = new Date(
        Date.now() + session.EXPIRATION_IN_MILLISECONDS,
      );

      const mockSession = {
        token_protheus: uuidv4(),
        token: uuidv4(),
        id: uuidv4(),
      };

      const objectUser = {
        username: process.env.USERNAME_TEST,
        password: process.env.PASSWORD_TEST,
        id: uuidv4(),
      };

      const mockResponseCreated = {
        id: uuidv4(),
        token: uuidv4(),
        token_protheus: mockSession.token_protheus,
        user_id: mockSession.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: expiresAtMock.toISOString(),
      };

      authentication.getAuthenticateUser.mockResolvedValue(mockSession);
      session.create.mockResolvedValue(mockResponseCreated);

      const request = createRequest({
        method: "POST",
        path: PATH_URL,
        body: {
          username: objectUser.username,
          password: objectUser.password,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.CREATE);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        token_protheus: responseBody.token_protheus,
        user_id: responseBody.user_id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
      });

      const expiresAt = new Date(responseBody.expires_at).setMilliseconds(0);
      const createdAt = new Date(responseBody.created_at).setMilliseconds(0);
      const validExpiredTime = expiresAt - createdAt;

      expect(validExpiredTime).toBe(session.EXPIRATION_IN_MILLISECONDS);

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: COOKIE_NAME,
        value: responseBody.token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
