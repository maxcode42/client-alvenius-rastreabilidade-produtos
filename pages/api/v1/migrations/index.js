import { createRouter } from "next-connect";

import migrator from "models/migrator";
import controller from "infra/controller";
import { STATUS_CODE } from "/types/status-code";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, res) {
  const results = await migrator.listPendingMigrations();

  res.status(STATUS_CODE.SUCCESS).json(results);
}

async function postHandler(_, res) {
  const results = await migrator.runPendingMigrations();

  const status = results.length > 0 ? STATUS_CODE.CREATE : STATUS_CODE.SUCCESS;

  res.status(status).json(results);
}
