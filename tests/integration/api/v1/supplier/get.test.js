import setCookieParser from "set-cookie-parser";

import session from "models/session";
import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";
import { PROCESS_FLOW } from "types/process-flow";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET '/api/v1/supplier'", () => {
  describe("Default user", () => {
    test("With valid session and return list boilermaking", async () => {
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

      PATH_URL = `/api/v1/supplier/${PROCESS_FLOW.route.boilermaking.acronym}`;

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: responseSessionBody.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(Array.isArray(responseBody)).toBe(true);
      expect(
        responseBody.length === 0 ||
          responseBody.some((i) => i.boolikings === "S"),
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
    test("With valid session and return list coating", async () => {
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

      PATH_URL = `/api/v1/supplier/${PROCESS_FLOW.route.coating.acronym}`;

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: responseSessionBody.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(Array.isArray(responseBody)).toBe(true);
      expect(
        responseBody.length === 0 ||
          responseBody.some((i) => i.coating === "S"),
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
    test("With valid session and return list painting", async () => {
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

      PATH_URL = `/api/v1/supplier/${PROCESS_FLOW.route.painting.acronym}`;

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "GET",
        token: responseSessionBody.token,
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(Array.isArray(responseBody)).toBe(true);
      expect(
        responseBody.length === 0 ||
          responseBody.some((i) => i.painting === "S"),
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
