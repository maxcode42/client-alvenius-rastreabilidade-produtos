import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";
import session from "models/session";

import { STATUS_CODE } from "types/status-code";
import { PROCESS_FLOW } from "types/process-flow";

let responseSessionBody;
let PATH_URL;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  responseSessionBody = await orchestrator.createAuth();
});

describe("POST '/api/v1/transfer/[process]'", () => {
  describe("Default user", () => {
    test("With valid session and does not create transfer", async () => {
      PATH_URL = `/api/v1/transfer/${PROCESS_FLOW.route.boilermaking.acronym}`;

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        token: responseSessionBody.token,
      });

      expect(response.status).toBe(STATUS_CODE.NOT_FOUND);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Um error interno inesperado ocorreu na request externa.",
        action: "Contate suporte tecnico.",
        status_code: 404,
      });
    });
    test("With valid session and create transfer", async () => {
      PATH_URL = `/api/v1/transfer/${PROCESS_FLOW.route.boilermaking.acronym}`;
      const objectData = await orchestrator.createRegisterObject();

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        token: responseSessionBody.token,
        object: {
          spools: [objectData.spool.codigo],
          supplier: objectData.itens[0].codigo,
          process: PROCESS_FLOW.route.boilermaking.acronym,
          third: "S",
        },
      });

      expect(response.status).toBe(STATUS_CODE.CREATE);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");

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
        value: responseSessionBody.token,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
