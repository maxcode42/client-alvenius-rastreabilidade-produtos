import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";
import session from "models/session";

import { STATUS_CODE } from "types/status-code";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET '/api/v1/boilermaking", () => {
  describe("Default user", () => {
    test("With valid session and return list", async () => {
      let PATH_URL = "/api/v1/sessions";

      const objectUser = {
        username: process.env.USERNAME_TEST,
        password: process.env.PASSWORD_TEST,
      };

      const responseSession = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: {
          username: objectUser.username,
          password: objectUser.password,
        },
      });
      expect(responseSession.status).toBe(STATUS_CODE.CREATE);

      const responseSessionBody = await responseSession.json();

      PATH_URL = "/api/v1/boilermaking";

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: responseSessionBody.token,
      });
      const responseBody = await response.json();

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      expect(responseBody.total).toBeDefined();
      expect(typeof responseBody).toBe("object");
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(Array.isArray(responseBody.quantities)).toBe(true);
      expect(
        responseBody.data.length === 0 ||
          responseBody.data.some((i) => i.process_acronym === "CA"),
      ).toBe(true);

      // VALIDA CACHE NAVEGADOR ESTÁ DESATIVADO
      const cacheControl = response.headers.get("Cache-control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: process.env.COOKIE_NAME,
        value: responseSessionBody.token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
