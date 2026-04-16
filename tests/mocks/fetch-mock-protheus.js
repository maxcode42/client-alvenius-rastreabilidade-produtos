crypto = require("node:crypto");

const http = require("node:http");
const { parse } = require("node:url");

require("dotenv").config({
  path: ".env.development",
});

function createProtheusMockServer({ port = 4001 } = {}) {
  let server;

  // Registry dinâmico de rotas
  const routes = new Map();

  function buildKey(method, path) {
    return `${method.toUpperCase()} ${path}`;
  }

  function defaultHandler(req, res) {
    console.log(`[MOCK][UNHANDLED] ${req.method} ${req.url}`);

    res.writeHead(500, { "Content-Type": "application/json" });
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
          console.log(`[MOCK HIT] ${req.method} ${req.url}`);

          await handler(req, res, {
            query: parsedUrl.query,
          });
        } catch (error) {
          console.error("[MOCK][ERROR]", error);

          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Internal mock error",
            }),
          );
        }
      });

      server.listen(port, "127.0.0.1", () => {
        console.log(`[MOCK] Protheus rodando em http://127.0.0.1:${port}`);

        // DEBUG: rotas registradas
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

  // 🔹 DEFAULTS (rotas principais da API externa)
  function setupDefaults() {
    on("GET", "/", async (req, res) => {
      console.log("[MOCK] STATUS HIT");

      res.writeHead(200, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          status_code: 200,
          message: "Status comunicação realizado com api externa.",
        }),
      );
    });

    on("POST", "/api/oauth2/v1/token", async (req, res, { query }) => {
      const { username, password } = query;

      if (
        username !== process.env.USERNAME_TEST ||
        password !== process.env.PASSWORD_TEST
      ) {
        res.writeHead(401, { "Content-Type": "application/json" });

        return res.end(
          JSON.stringify({
            code: 401,
            message:
              "invalid_grant Falha de autenticação para o usuário incorrect username.",
            detailedMessage:
              "invalid_grant Falha de autenticação para o usuário incorrect username.",
          }),
        );
      }

      const token = crypto.randomBytes(48).toString("hex");

      res.writeHead(200, { "Content-Type": "application/json" });

      return res.end(
        JSON.stringify({
          access_token: token,
          refresh_token: `${token}-${Date.now()}`,
          scope: "default",
          token_type: "Bearer",
          expires_in: 3600,
          status_code: 200,
          hasMFA: false,
        }),
      );
    });

    /**
     * 🔹 MOCK: STATUS
     */
    on("GET", "/wsrastreio", async (req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify([
          {
            Status: true,
          },
        ]),
      );
    });

    /**
     * 🔹 MOCK: CREATE REGISTER
     */
    on("POST", "/wsrastreio", async (req, res) => {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status_code: 201,
          message: "Registro criado (mock)",
        }),
      );
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
