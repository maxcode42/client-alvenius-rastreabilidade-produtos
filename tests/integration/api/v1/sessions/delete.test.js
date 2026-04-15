import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";
import session from "models/session";

import { STATUS_CODE } from "types/status-code";

const PATH_URL = "/api/v1/sessions";
const COOKIE_NAME = process.env.COOKIE_NAME;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE '/api/v1/sessions", () => {
  describe("Default user", () => {
    test("With nonexistent session", async () => {
      const nonexistent =
        "47cbed8b1f6b70775adfbf4d1dc5a3690ef18d95155db593a8a9204d32f921b6855f52787c36b242d569be5c2602a27c";

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: nonexistent,
      });

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
    test("With expired session", async () => {
      const dateInPast = new Date(
        Date.now() - session.EXPIRATION_IN_MILLISECONDS,
      );

      // Configura relógio do processo para data passada
      jest.useFakeTimers({
        now: dateInPast,
      });

      const objectUser = {
        username: "new user session expired",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const objectSession = await orchestrator.createSession(createUser.id);

      // Restaura relógio do processo data atual
      jest.useRealTimers();

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: objectSession.token,
      });

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
      const objectUser = {
        username: "user valid session",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const objectSession = await orchestrator.createSession(createUser.id);

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: objectSession.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(
        responseBody.expires_at < objectSession.expires_at.toISOString(),
      ).toBe(true);

      expect(
        responseBody.updated_at > objectSession.updated_at.toISOString(),
      ).toBe(true);

      expect(responseBody).toEqual({
        id: objectSession.id,
        token: objectSession.token,
        token_protheus: objectSession.token_protheus,
        user_id: objectSession.user_id,
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
      const doubleCheckResponse = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: objectSession.token,
      });

      expect(doubleCheckResponse.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const doubleCheckResponseBody = await doubleCheckResponse.json();

      expect(doubleCheckResponseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });
    });
    test("With in one minute to expire session", async () => {
      const dateOneMinutePast = session.EXPIRATION_IN_MILLISECONDS - 60 * 1000;
      const dateInPast = new Date(Date.now() - dateOneMinutePast);

      // Configura relógio do processo para data passada
      jest.useFakeTimers({
        now: dateInPast,
      });

      const createUser = await orchestrator.createUser();

      const objectSession = await orchestrator.createSession(createUser.id);
      jest.useRealTimers();

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: objectSession.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(
        responseBody.expires_at < objectSession.expires_at.toISOString(),
      ).toBe(true);

      expect(
        responseBody.updated_at > objectSession.updated_at.toISOString(),
      ).toBe(true);

      expect(responseBody).toEqual({
        id: objectSession.id,
        token: objectSession.token,
        token_protheus: objectSession.token_protheus,
        user_id: objectSession.user_id,
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
      const doubleCheckResponse = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "DELETE",
        token: objectSession.token,
      });

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
