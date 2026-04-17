import { createRouter } from "next-connect";

import database from "/infra/database";
import controller from "infra/controller";

import { STATUS_CODE } from "types/status-code";
import apiProtheus from "infra/provider/api-protheus";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResults = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResults.rows[0].server_version;

  const databaseMaxConnectionsResults = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResults.rows[0].max_connections,
  );

  const databaseOpenedConnectionsResults = await database.query({
    text: `
      SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1 
    ;`,
    values: [process.env.POSTGRES_DB],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResults.rows[0].count;

  const statusAPIProtheus = await callAPIProtheus();

  const results = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
      integration: {
        api_external: {
          erp: statusAPIProtheus,
        },
      },
    },
  };

  async function callAPIProtheus() {
    try {
      const response = await apiProtheus.execute.status.get();

      return await response;
    } catch (error) {
      console.error("[PROTHEUS FAIL]:", error.message);

      return error;
    }
  }

  res.status(STATUS_CODE.SUCCESS).json(results);
}
