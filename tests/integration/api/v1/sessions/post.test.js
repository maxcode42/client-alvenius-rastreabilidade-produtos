import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import session from "models/session";
import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

const PATH_URL = "/api/v1/sessions";
const COOKIE_NAME = process.env.COOKIE_NAME;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST '/api/v1/sessions'", () => {
  describe("Anonymous user", () => {
    test("With incorrect `username` and incorrect `password`", async () => {
      const objectUser = {
        username: "user and password incorrect",
        password: "senhaTest123Incorrect",
      };

      // await orchestrator.createUser(objectUser);

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: {
          username: objectUser.username,
          password: objectUser.password,
        },
      });

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

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: {
          username: "incorrect username",
          password: objectUser.password,
        },
      });

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

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: {
          username: objectUser.username,
          password: "incorrect password",
        },
      });

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
      const objectUser = {
        username: process.env.USERNAME_TEST,
        password: process.env.PASSWORD_TEST,
      };

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: {
          username: objectUser.username,
          password: objectUser.password,
        },
      });
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
