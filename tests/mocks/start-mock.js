const createProtheusMockServer = require("./api-protheus");

const path = require("node:path");

const envPath = path.resolve(process.cwd(), ".env.development");

const result = require("dotenv").config({
  path: envPath,
});

if (result.error) {
  console.error("[ENV ERROR]:", result.error);
}
// else {
//   console.log("[ENV LOADED]:", Object.keys(result.parsed));
// }

async function start() {
  const server = createProtheusMockServer({
    port: 4001,
  });

  // carrega mocks padrão
  server.httpSetup();

  // inicia servidor
  await server.start();

  // opcional: graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n[MOCK] Encerrando...");
    await server.stop();
    process.exit(0);
  });
}

start();
