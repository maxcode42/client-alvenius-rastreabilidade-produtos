const path = require("node:path");

// garante carregamento correto do .env
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.development"),
});

const { getProtheusBaseURL } = require("../../../infra/config/env");
const { createRouteRegistry } = require("../server/route-registry");
const { createHttpServer } = require("../server/http-server");
const { httpSetup } = require("./http-setup");

/* extrai porta da BASE_URL */
function extractPortFromURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.port ? Number(parsed.port) : 80;
  } catch {
    return 4001; // fallback seguro
  }
}

function createProtheusMockServer({ port } = {}) {
  const baseURL = getProtheusBaseURL();

  // prioridade: env → param → fallback
  const resolvedPort = port || extractPortFromURL(baseURL) || 4001;

  const registry = createRouteRegistry();

  const server = createHttpServer({
    port: resolvedPort,
    registry,
  });

  function on(method, path, handler) {
    registry.on(method, path, handler);
  }

  function reset() {
    registry.reset();
  }

  function setup() {
    httpSetup({ on });
  }

  return {
    start: server.start,
    stop: server.stop,
    on,
    reset,
    httpSetup: setup,
  };
}

module.exports = createProtheusMockServer;
