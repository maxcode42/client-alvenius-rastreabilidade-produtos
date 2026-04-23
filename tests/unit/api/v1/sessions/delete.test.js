import { version as uuidVersion, v4 as uuidv4 } from "uuid";
import setCookieParser from "set-cookie-parser";

import { UnauthorizedError } from "infra/errors";
import { STATUS_CODE } from "types/status-code";

import { setupTest } from "tests/mocks/jest/setup-test";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";
import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";

const PATH_URL = "/api/v1/sessions";
const COOKIE_NAME = process.env.COOKIE_NAME;

jest.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

const { session } = setupTest({
  models: {
    "models/session": ["findOneValidByToken", "expireById"],
  },
  spy: ["controller.setSessionCookie"],
});

const mockResponseUnauthorized = {
  name: "UnauthorizedError",
  message: "Usuário não possui uma sessão ativa.",
  action: "Verifique se esse usuário esta logado e tente novamente.",
  status_code: STATUS_CODE.UNAUTHORIZED,
};

describe("DELETE '/api/v1/sessions' (controller unit)", () => {
  let handler;

  beforeAll(() => {
    handler = require("pages/api/v1/sessions").default;
  });

  describe("Default user", () => {
    test("With nonexistent session", async () => {
      const nonexistent = uuidv4();

      session.findOneValidByToken.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const request = createRequest({
        path: PATH_URL,
        method: "DELETE",
        token: nonexistent,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });

    test("With valid session", async () => {
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + session.EXPIRATION_IN_MILLISECONDS,
      );
      const updatedAt = new Date(now.getTime() + 1000);

      const mockSession = {
        token_protheus: uuidv4(),
        token: uuidv4(),
        id: uuidv4(),
      };

      const mockValidSession = {
        id: uuidv4(),
        token: uuidv4(),
        token_protheus: mockSession.token_protheus,
        user_id: mockSession.id,
        created_at: new Date().toISOString(),
        updated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      const mockExpiredSession = {
        ...mockValidSession,
        expires_at: now.toISOString(),
        updated_at: updatedAt.toISOString(),
      };

      session.findOneValidByToken.mockResolvedValue(mockValidSession);
      session.expireById.mockResolvedValue(mockExpiredSession);

      const request = createRequest({
        path: PATH_URL,
        method: "DELETE",
        token: mockValidSession.token,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody.expires_at < mockValidSession.expires_at).toBe(true);
      expect(responseBody.updated_at > mockValidSession.updated_at).toBe(true);

      expect(responseBody).toEqual({
        id: mockValidSession.id,
        token: mockValidSession.token,
        token_protheus: mockValidSession.token_protheus,
        user_id: mockValidSession.user_id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[COOKIE_NAME]).toEqual({
        maxAge: -1, // define para navegador excluir cookie
        name: COOKIE_NAME,
        value: "invalid",
        httpOnly: true,
        path: "/",
      });

      // Double check assertion
      session.findOneValidByToken.mockRejectedValue(
        new UnauthorizedError(mockResponseUnauthorized),
      );

      const doubleCheckRequest = createRequest({
        path: PATH_URL,
        method: "DELETE",
        token: mockValidSession.token,
      });
      const doubleCheckResponse = createHttpMock();

      await doubleCheckResponse.execute(handler, doubleCheckRequest);

      expect(doubleCheckResponse.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const doubleCheckResponseBody = await doubleCheckResponse.json();

      expect(doubleCheckResponseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
  });
});
