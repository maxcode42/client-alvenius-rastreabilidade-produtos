import { createRouter } from "next-connect";

import user from "models/user";
import controller from "infra/controller";
import { STATUS_CODE } from "types/status-code";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const username = req.query.username;

  const results = await user.findOnByUsername(username);

  res.status(STATUS_CODE.SUCCESS).json(results);
}
