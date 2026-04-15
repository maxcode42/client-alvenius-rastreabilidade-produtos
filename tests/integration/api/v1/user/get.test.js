import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";
import session from "models/session";

import { STATUS_CODE } from "types/status-code";

const PATH_URL = "/api/v1/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET '/api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const objectUser = {
        username: "new user valid session",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const objectSession = await orchestrator.createSession(createUser.id);

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: objectSession.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      // VALIDA CACHE NAVEGADOR ESTÁ DESATIVADO
      const cacheControl = response.headers.get("Cache-control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: createUser.id,
        username: createUser.username,
        password: createUser.password,
        created_at: createUser.created_at.toISOString(),
        updated_at: createUser.updated_at.toISOString(),
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: process.env.COOKIE_NAME,
        value: objectSession.token,
        httpOnly: true,
        path: "/",
      });
    });
    test("With nonexistent session", async () => {
      const nonexistent =
        "47cbed8b1f6b70775adfbf4d1dc5a3690ef18d95155db593a8a9204d32f921b6855f52787c36b242d569be5c2602a27c";

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
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

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
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
        username: "new user expired session",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const sessionObject = await orchestrator.createSession(createUser.id);

      // Restaura relógio do processo
      jest.useRealTimers();

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: sessionObject.token,
      });

      expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
        status_code: STATUS_CODE.UNAUTHORIZED,
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });
    test("With in one minute to expire session", async () => {
      const dateOneMinutePast = session.EXPIRATION_IN_MILLISECONDS - 60 * 1000;
      const dateInPast = new Date(Date.now() - dateOneMinutePast);

      // Configura relógio do processo para data passada
      jest.useFakeTimers({
        now: dateInPast,
      });

      const objectUser = {
        username: "new user minute to expired",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const sessionObject = await orchestrator.createSession(createUser.id);
      jest.useRealTimers();

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: sessionObject.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      // Valida cache navegador está desativado
      const cacheControl = response.headers.get("Cache-control");
      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: createUser.id,
        username: createUser.username,
        email: createUser.email,
        password: createUser.password,
        created_at: createUser.created_at.toISOString(),
        updated_at: createUser.updated_at.toISOString(),
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: process.env.COOKIE_NAME,
        value: sessionObject.token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
