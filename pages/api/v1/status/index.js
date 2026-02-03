import { createRouter } from "next-connect";

import { STATUS_CODE } from "types/status-code";

const router = createRouter();

router.get(getHandler);

export default router.handler();

async function getHandler(_, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionValue = "v1.0.0";
  const databaseMaxConnectionsValue = parseInt("100");
  const databaseOpenedConnectionsValue = 10;

  const results = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connection: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  };

  res.status(STATUS_CODE.SUCCESS).json(results);
}
