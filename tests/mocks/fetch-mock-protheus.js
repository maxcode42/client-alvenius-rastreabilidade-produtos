const crypto = require("node:crypto");
const http = require("node:http");
const { parse } = require("node:url");

const { STATUS_CODE } = require("../../types/status-code");
const { PROCESS_FLOW } = require("../../types/process-flow");

require("dotenv").config({
  path: ".env.development",
});

/* Helper para parsear o body (JSON / form / raw) */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) return resolve(null);

      const contentType = req.headers["content-type"] || "";

      try {
        // JSON
        if (contentType.includes("application/json")) {
          return resolve(JSON.parse(body));
        }

        // x-www-form-urlencoded
        if (contentType.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams(body);
          return resolve(Object.fromEntries(params.entries()));
        }

        // fallback (texto puro)
        return resolve(body);
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function createProtheusMockServer({ port = 4001 } = {}) {
  let server;

  const routes = new Map();

  function buildKey(method, path) {
    return `${method.toUpperCase()} ${path}`;
  }

  function defaultHandler(req, res) {
    console.log(`[MOCK][UNHANDLED] ${req.method} ${req.url}`);

    res.writeHead(STATUS_CODE.SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: "Mock route not implemented",
        method: req.method,
        path: req.url,
      }),
    );
  }

  function start() {
    return new Promise((resolve) => {
      server = http.createServer(async (req, res) => {
        const parsedUrl = parse(req.url, true);
        const path = parsedUrl.pathname;

        const key = buildKey(req.method, path);
        const handler = routes.get(key) || defaultHandler;

        try {
          /* Parse do body antes de chamar handler */
          const body = await parseRequestBody(req);

          // injeta estilo Express
          req.body = body;

          await handler(req, res, {
            query: parsedUrl.query,
            body,
          });
        } catch (error) {
          console.error("[MOCK][ERROR]", error);

          res.writeHead(STATUS_CODE.SERVER_ERROR, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: "Internal mock error",
            }),
          );
        }
      });

      server.listen(port, "127.0.0.1", () => {
        console.log(`[MOCK] Protheus rodando em http://127.0.0.1:${port}`);
        console.log("ROTAS ATIVAS:", Array.from(routes.keys()));
        resolve();
      });
    });
  }

  function stop() {
    return new Promise((resolve) => {
      server.close(() => resolve());
    });
  }

  function on(method, path, handler) {
    routes.set(buildKey(method, path), handler);
  }

  function reset() {
    routes.clear();
  }

  // DEFAULTS (rotas principais da API externa)
  function setupDefaults() {
    /* MOCK: STATUS */
    on("GET", "/", async (req, res) => {
      res.writeHead(STATUS_CODE.SUCCESS, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status_code: STATUS_CODE.SUCCESS,
          message: "Status comunicação realizado com api externa.",
        }),
      );
    });

    /* MOCK: SESSION / TOKEN */
    on("POST", "/api/oauth2/v1/token", async (req, res, { query, body }) => {
      // const { username, password } = body || {};
      const { username, password } = query;

      if (
        username !== process.env.USERNAME_TEST ||
        password !== process.env.PASSWORD_TEST
      ) {
        res.writeHead(STATUS_CODE.UNAUTHORIZED, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            code: STATUS_CODE.UNAUTHORIZED,
            message: "invalid_grant",
            detailedMessage: "invalid_grant",
          }),
        );
      }

      const token = crypto.randomBytes(48).toString("hex");

      res.writeHead(STATUS_CODE.SUCCESS, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          access_token: token,
          refresh_token: `${token}-${Date.now()}`,
          scope: "default",
          token_type: "Bearer",
          expires_in: 3600,
          status_code: STATUS_CODE.SUCCESS,
          hasMFA: false,
        }),
      );
    });

    /* MOCK: CREATE REGISTER */
    on("POST", "/wsrastreio", async (req, res) => {
      res.writeHead(STATUS_CODE.CREATE, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "Created",
          status_code: STATUS_CODE.CREATE,
          message: "Registro importado com sucesso",
        }),
      );
    });

    /* MOCK PROCESS FLOW */
    on("GET", "/wsrastreio/process", async (req, res) => {
      const parsedUrl = new URL(req.url, "http://localhost");

      const rawQuery = parsedUrl.search.replace("?", "");

      if (rawQuery === PROCESS_FLOW.route.boilermaking.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                COD: "SP041400049028 ",
                SEQ: "    ",
                DTENTR: "20260416",
                DTINIC: "20260416",
                HRINIC: "16:09",
                DTSAID: "        ",
                HRSAID: "     ",
                USER: "lucas.penha                   ",
                PROCES: "CA",
                STATUS: "EX",
                DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
              },
            ],
          }),
        );
      }
      if (rawQuery === PROCESS_FLOW.route.coating.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                COD: "SP041400049028 ",
                SEQ: "    ",
                DTENTR: "20260416",
                DTINIC: "20260416",
                HRINIC: "16:09",
                DTSAID: "        ",
                HRSAID: "     ",
                USER: "lucas.penha                   ",
                PROCES: "RR",
                STATUS: "EX",
                DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
              },
            ],
          }),
        );
      }
      if (rawQuery === PROCESS_FLOW.route.painting.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                COD: "SP041400049028 ",
                SEQ: "    ",
                DTENTR: "20260416",
                DTINIC: "20260416",
                HRINIC: "16:09",
                DTSAID: "        ",
                HRSAID: "     ",
                USER: "lucas.penha                   ",
                PROCES: "PI",
                STATUS: "EX",
                DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
              },
            ],
          }),
        );
      }
    });

    on("POST", "/wsrastreio/new", async (req, res) => {
      console.log(">> BODY RECEBIDO:");
      console.log(req.body);

      const data = req.body;

      // res.writeHead(STATUS_CODE.CREATE, {
      //   "Content-Type": "application/json",
      // });

      // res.end(
      //   JSON.stringify({
      //     status_code: STATUS_CODE.CREATE,
      //     message: "SUCESSO",
      //   }),
      // );

      const responseCreate = {
        status: "Created",
        status_code: STATUS_CODE.CREATE,
        message: "Registro atualizado com sucesso",
      };

      if (data.processo === PROCESS_FLOW.route.boilermaking.acronym) {
        res.writeHead(STATUS_CODE.CREATE, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(responseCreate));
      }

      if (data.processo === PROCESS_FLOW.route.coating.acronym) {
        res.writeHead(STATUS_CODE.CREATE, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(responseCreate));
      }
      if (data.processo === PROCESS_FLOW.route.painting.acronym) {
        res.writeHead(STATUS_CODE.CREATE, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(responseCreate));
      }
    });

    /* MOCK: SUPPLIER */
    on("GET", "/wsrastreio/list_fornec", async (req, res, { query }) => {
      const { process } = query;

      if (process === PROCESS_FLOW.route.boilermaking.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                CODIGO: "003385",
                LOJA: "01",
                NOME: "PETROPASY TECNOLOGIA",
                CALDERARIA: "S",
                REVESTIMENTO: "S",
                PINTURA: " ",
              },
              {
                CODIGO: "003671",
                LOJA: "01",
                NOME: "BENAZZI             ",
                CALDERARIA: "S",
                REVESTIMENTO: "N",
                PINTURA: " ",
              },
              {
                CODIGO: "004449",
                LOJA: "01",
                NOME: "CORFAL              ",
                CALDERARIA: "S",
                REVESTIMENTO: "S",
                PINTURA: "S",
              },
            ],
          }),
        );
      }
      if (process === PROCESS_FLOW.route.coating.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                CODIGO: "003295",
                LOJA: "01",
                NOME: "SO JATO             ",
                CALDERARIA: "N",
                REVESTIMENTO: "N",
                PINTURA: "S",
              },
              {
                CODIGO: "004449",
                LOJA: "01",
                NOME: "CORFAL              ",
                CALDERARIA: "S",
                REVESTIMENTO: "S",
                PINTURA: "S",
              },
              {
                CODIGO: "005455",
                LOJA: "01",
                NOME: "PROJATO JATEAMENTO E",
                CALDERARIA: "N",
                REVESTIMENTO: "N",
                PINTURA: "S",
              },
            ],
          }),
        );
      }
      if (process === PROCESS_FLOW.route.painting.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            objects: [
              {
                CODIGO: "003385",
                LOJA: "01",
                NOME: "PETROPASY TECNOLOGIA",
                CALDERARIA: "S",
                REVESTIMENTO: "S",
                PINTURA: " ",
              },
              {
                CODIGO: "003671",
                LOJA: "01",
                NOME: "BENAZZI             ",
                CALDERARIA: "S",
                REVESTIMENTO: "N",
                PINTURA: " ",
              },
              {
                CODIGO: "004449",
                LOJA: "01",
                NOME: "CORFAL              ",
                CALDERARIA: "S",
                REVESTIMENTO: "S",
                PINTURA: "S",
              },
            ],
          }),
        );
      }
    });

    /* MOCK: TRANSFER */
    on("GET", "/wsrastreio/listrom", async (req, res, { query }) => {
      const { process } = query;
      const STATUS_LIST = [
        {
          SIGLA: "SC",
          ORDEM: 1,
          STATUS: "Aguardando SC",
        },
        {
          SIGLA: "PV",
          ORDEM: 2,
          STATUS: "Aguardando PV",
        },
        {
          SIGLA: "RO",
          ORDEM: 3,
          STATUS: "Aguardando ROM",
        },
        {
          SIGLA: "NF",
          ORDEM: 4,
          STATUS: "Aguardando NF",
        },
        {
          SIGLA: "EM",
          ORDEM: 5,
          STATUS: "Nota Emitida",
        },
      ];

      if (process === PROCESS_FLOW.route.boilermaking.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            STATUS_LIST,
            objects: [
              {
                STATUS: [
                  {
                    SIGLA: "SC",
                    STATUS: "Aguardando SC",
                  },
                ],
                SPOOLS: ["SP041500345003 ", "SP041500345004 "],
                CODIGO: "000001",
                COD_FORNEC: "005436",
                LOJA_FORNEC: "01",
                NOME_FORNEC: "GRUPO – FLANJACO    ",
                NUM_SC: "      ",
                PEDIDO: "      ",
                ROMANEIO: "      ",
                REVISAO: "  ",
                AET: "S",
                PROCESSO: "CA",
              },
              {
                STATUS: [
                  {
                    SIGLA: "SC",
                    STATUS: "Aguardando SC",
                  },
                ],
                SPOOLS: ["SP041500302009 ", "SP041500426020 "],
                CODIGO: "000002",
                COD_FORNEC: "005436",
                LOJA_FORNEC: "01",
                NOME_FORNEC: "GRUPO – FLANJACO    ",
                NUM_SC: "      ",
                PEDIDO: "      ",
                ROMANEIO: "      ",
                REVISAO: "  ",
                AET: "S",
                PROCESSO: "CA",
              },
              {
                STATUS: [
                  {
                    SIGLA: "SC",
                    STATUS: "Aguardando SC",
                  },
                ],
                SPOOLS: ["SP041500230006 ", "SP041500232006 "],
                CODIGO: "000003",
                COD_FORNEC: "005436",
                LOJA_FORNEC: "01",
                NOME_FORNEC: "GRUPO – FLANJACO    ",
                NUM_SC: "      ",
                PEDIDO: "      ",
                ROMANEIO: "      ",
                REVISAO: "  ",
                AET: "S",
                PROCESSO: "CA",
              },
            ],
          }),
        );
      }
      if (process === PROCESS_FLOW.route.coating.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            STATUS_LIST,
            objects: [],
          }),
        );
      }
      if (process === PROCESS_FLOW.route.painting.acronym) {
        res.writeHead(STATUS_CODE.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            STATUS_LIST,
            objects: [],
          }),
        );
      }
    });
  }

  return {
    start,
    stop,
    on,
    reset,
    setupDefaults,
  };
}

module.exports = createProtheusMockServer;
