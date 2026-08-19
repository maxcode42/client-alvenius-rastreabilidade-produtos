const http = require("node:http");

const { parseRequestBody } = require("./body-parser");
const { STATUS_CODE } = require("../../../types/status-code");
const { getProtheusBaseURL } = require("../../../infra/config/env");

function createHttpServer({ port, registry }) {
  let server;

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
        // substitui parse() por URL (mais moderno e completo)
        const parsedUrl = new URL(req.url, "http://localhost");

        const pathname = parsedUrl.pathname;

        const handler = registry.get(req.method, pathname) || defaultHandler;

        try {
          const body = await parseRequestBody(req);
          req.body = body;

          // query estruturada (equivalente ao parse antigo)
          const query = Object.fromEntries(parsedUrl.searchParams.entries());

          // query RAW (novo suporte)
          const rawQuery = parsedUrl.search.replace("?", "");

          await handler(req, res, {
            query,
            rawQuery,
            body,
          });
        } catch (err) {
          console.error("[MOCK][ERROR]", err);

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

      server.listen(port, () => {
        const baseURL = getProtheusBaseURL();
        console.log(`[MOCK] ${baseURL}`);
        console.log("ROTAS:", registry.list());
        resolve();
      });
    });
  }

  function stop() {
    return new Promise((resolve) => {
      server.close(() => resolve());
    });
  }

  return { start, stop };
}

module.exports = { createHttpServer };
