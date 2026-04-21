import user from "models/user";
import session from "models/session";
import handler from "pages/api/v1/user";
import controller from "infra/controller";

import { v4 as uuidv4, version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import { STATUS_CODE } from "types/status-code";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";
import { NotFoundError, UnauthorizedError } from "infra/errors";

jest.mock("models/user");
jest.mock("models/session");

jest.spyOn(controller, "setSessionCookie").mockImplementation((res, token) => {
  res.setHeader("Set-Cookie", [
    `${process.env.COOKIE_NAME}=${token}; Max-Age=${
      session.EXPIRATION_IN_MILLISECONDS / 1000
    }; Path=/; HttpOnly`,
  ]);
});

const PATH_URL = "/api/v1/user";

describe("GET '/api/v1/user' (controller unit)", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const objectUser = {
        username: "new user valid session",
        password: "senhaTest123",
      };

      const mockResponse = {
        id: uuidv4(),
        username: "new user",
        password: "hashed-password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSession = {
        user_id: objectUser.id,
        token: uuidv4(),
      };

      session.findOneValidByToken.mockResolvedValue(mockSession);
      user.findOnById.mockResolvedValue(mockResponse);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${mockSession.token}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      // VALIDA CACHE NAVEGADOR ESTÁ DESATIVADO
      const cacheControl = response.getHeader("Cache-control");

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
        id: mockResponse.id,
        username: mockResponse.username,
        password: mockResponse.password,
        created_at: mockResponse.created_at,
        updated_at: mockResponse.updated_at,
      });

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
    test("With nonexistent session", async () => {
      const nonexistent =
        "47cbed8b1f6b70775adfbf4d1dc5a3690ef18d95155db593a8a9204d32f921b6855f52787c36b242d569be5c2602a27c";

      const mockError = new UnauthorizedError({
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
      });

      session.findOneValidByToken.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${nonexistent}`,
        },
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

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(
        response.getHeader("set-cookie"),
        { map: true },
      );

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        name: process.env.COOKIE_NAME,
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });
    test("With expired session", async () => {
      const token = "expired-token";

      const mockError = new UnauthorizedError({
        message: "Usuário não possui uma sessão ativa.",
        action: "Verifique se esse usuário esta logado e tente novamente.",
      });

      // simula sessão expirada
      session.findOneValidByToken.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${token}`,
        },
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

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(
        response.getHeader("set-cookie"),
        {
          map: true,
        },
      );

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        name: process.env.COOKIE_NAME,
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });
    test("With in one minute to expire session", async () => {
      const userId = "user-123";
      const token = "valid-token";

      const mockSession = {
        user_id: userId,
        token,
      };

      const mockUser = {
        id: userId,
        username: "new user minute to expired",
        password: "hashed-password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // sessão válida (mesmo perto de expirar)
      session.findOneValidByToken.mockResolvedValue(mockSession);
      user.findOnById.mockResolvedValue(mockUser);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${token}`,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      // cache-control
      const cacheControl = response.getHeader("Cache-Control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        password: mockUser.password,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      });

      // Set-Cookie assertions (refresh da sessão)
      const parsedSetCookie = setCookieParser(
        response.getHeader("set-cookie"),
        { map: true },
      );

      expect(parsedSetCookie[process.env.COOKIE_NAME]).toEqual({
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        name: process.env.COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
