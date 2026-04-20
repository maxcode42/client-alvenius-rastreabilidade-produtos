import setCookieParser from "set-cookie-parser";

import session from "models/session";
import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";
import { PROCESS_FLOW } from "types/process-flow";
import { PROCESS_STATUS } from "types/process-status";

const PATH_URL = "/api/v1/painting";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

const objectDefaultRegister = {
  spool: {
    codigo: "SP041500345003",
    descricao: "CARRETEL FS+FF 20POL X 6,35 X 2961MM 150 PSI",
  },
  itens: [
    {
      codigo: "TJPLPL50K000311",
      fornecedor: "005436",
      fluxo: "teste tubo",
      descricao:
        "TUBO ASTM A134 PL 508MM X 6,30MM ASTM A 283 GRC DIMENSOES CONF.ASME B 36.10",
      quantidade: 1.32,
    },
    {
      codigo: "FLW21224113Z211",
      fornecedor: "005436",
      fluxo: "teste FS",
      descricao:
        "Flange solto, 20pol, face plana, dimensões conforme AWWA C 207 TAB.2 CLASSE D",
      quantidade: 1,
    },
  ],
};

describe("POST '/api/v1/painting'", () => {
  describe("Default user", () => {
    test("With valid session and update status", async () => {
      const objectRegister = {
        codigo: objectDefaultRegister.spool.codigo,
        status: PROCESS_FLOW.acronym.execute,
        processo: PROCESS_FLOW.route.painting.acronym,
        conformidade: "N",
        reversivel: "N",
        disposicao_qualidade: "",
      };
      const sessionAuth = await orchestrator.createAuth();

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
