import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

import session from "models/session";
import { PROCESS_FLOW } from "types/process-flow";

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
    test("With valid session and painting from 'reserverd' status to 'running'", async () => {
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
  });
});

/*
=====================================
{
  "QrCode": {
    "SPOOL":  "SP041500345003",
    "DESC": "CARRETEL FS+FF 20POL X 6,35 X 2961MM 150 PSI" ,
    "Componentes": [
        {
        "COD_PRODUTO": "TJPLPL50K000311",
        "COD_FORNEC": "005436",
        "CORRIDA": "teste tubo",
        "DESC":
            "TUBO ASTM A134 PL 508MM X 6,30MM ASTM A 283 GRC DIMENSOES CONF.ASME B 36.10",
        "QUANT": 1.32
        },
        {
        "COD_PRODUTO": "FLW21224113Z211",
        "COD_FORNEC": "005436",
        "CORRIDA": "teste FS",
        "DESC":
            "Flange solto, 20pol, face plana, dimensões conforme AWWA C 207 TAB.2 CLASSE D",
        "QUANT": 1.0
        }
    ]
  }
}
*/
