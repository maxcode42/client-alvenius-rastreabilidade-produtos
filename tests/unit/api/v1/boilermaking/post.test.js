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

describe("POST '/api/v1/boilermaking' (controller unit)", () => {
  let handler;

  beforeAll(() => {
    handler = require("pages/api/v1/boilermaking").default;
  });

  describe("Default user", () => {
    test.skip("With valid session and update status", async () => {
      const createRegisterObject = await orchestrator.createRegisterObject();
      const sessionAuth = await orchestrator.createAuth();

      await orchestrator.createRegister({
        token: sessionAuth.token,
        data: createRegisterObject,
      });

      const findRegister = await orchestrator.findRegister({
        route: PROCESS_FLOW.route.boilermaking.name,
        token: sessionAuth.token,
        params: createRegisterObject.spool.codigo,
      });

      const objectRegister = {
        codigo: findRegister.codigo,
        status: PROCESS_STATUS.acronym.executando,
        processo: PROCESS_FLOW.route.boilermaking.acronym,
        conformidade: "N",
        reversivel: "N",
        disposicao_qualidade: "",
      };

      const response = await orchestrator.fetchToExecute({
        method: "POST",
        path: PATH_URL,
        token: sessionAuth?.token,
        object: objectRegister,
      });

      expect(response.status).toEqual(STATUS_CODE.CREATE);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        status_code: STATUS_CODE.CREATE,
        message: "Registro importado com sucesso",
      });

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
        value: sessionAuth.token,
        httpOnly: true,
        path: "/",
      });
    });
    test.skip("With valid session and does not update status", async () => {
      const createRegisterObject = await orchestrator.createRegisterObject();
      const sessionAuth = await orchestrator.createAuth();

      await orchestrator.createRegister({
        token: sessionAuth.token,
        data: createRegisterObject,
      });

      const findRegister = await orchestrator.findRegister({
        route: PROCESS_FLOW.route.boilermaking.name,
        token: sessionAuth.token,
        params: createRegisterObject.spool.codigo,
      });

      const objectRegister = {
        codigo: findRegister.codigo,
        status: PROCESS_STATUS.acronym.executando,
        processo: "IV", // INVALID PROCESS
        conformidade: "N",
        reversivel: "N",
        disposicao_qualidade: "",
      };

      const response = await orchestrator.fetchToExecute({
        method: "POST",
        path: PATH_URL,
        token: sessionAuth?.token,
        object: objectRegister,
      });

      expect(response.status).toEqual(STATUS_CODE.NOT_FOUND);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        action: "Contate suporte tecnico.",
        status_code: STATUS_CODE.NOT_FOUND,
        message: "Um error interno inesperado ocorreu na request externa.",
      });
    });
  });
});
