import setCookieParser from "set-cookie-parser";

import session from "models/session";
import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";
import { PROCESS_FLOW } from "types/process-flow";
import { PROCESS_STATUS } from "types/process-status";

const PATH_URL = "/api/v1/coating";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST '/api/v1/coating'", () => {
  describe("Default user", () => {
    test("With valid session and update status", async () => {
      const createRegisterObject = await orchestrator.createRegisterObject();
      const sessionAuth = await orchestrator.createAuth();

      await orchestrator.createRegister({
        token: sessionAuth.token,
        data: createRegisterObject,
      });

      const findRegister = await orchestrator.findRegister({
        route: PROCESS_FLOW.route.coating.name,
        token: sessionAuth.token,
        params: createRegisterObject.spool.codigo,
      });

      const objectRegister = {
        codigo: findRegister.codigo,
        status: PROCESS_STATUS.acronym.executando,
        processo: PROCESS_FLOW.route.coating.acronym,
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
    test("With valid session and does not update status", async () => {
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
