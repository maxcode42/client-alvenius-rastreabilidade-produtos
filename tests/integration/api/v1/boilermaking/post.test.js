import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

import session from "models/session";
import { PROCESS_FLOW } from "types/process-flow";
import { PROCESS_STATUS } from "types/process-status";

const PATH_URL = "/api/v1/boilermaking";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST '/api/v1/boilermaking'", () => {
  describe("Default user", () => {
    test("With valid session and update status", async () => {
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
        message: "Registro atualizado com sucesso",
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

      await orchestrator.findRegister({
        route: PROCESS_FLOW.route.boilermaking.name,
        token: sessionAuth.token,
        params: createRegisterObject.spool.codigo,
      });

      const response = await orchestrator.fetchToExecute({
        method: "POST",
        path: PATH_URL,
        token: sessionAuth?.token,
      });

      //CORRIGIR RETORNO E APLICAR TRATATIVAS NA API
      expect(response.status).toEqual(STATUS_CODE.CREATE);
      const responseBody = await response.json();
      console.log(">>RESPONSE");
      console.log(responseBody);

      expect(responseBody).toEqual({
        status_code: STATUS_CODE.CREATE,
        message: "Registro atualizado com sucesso",
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
  });
});
