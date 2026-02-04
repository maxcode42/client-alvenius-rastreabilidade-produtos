import { createRouter } from "next-connect";

import user from "models/user";
import controller from "infra/controller";
import { STATUS_CODE } from "/types/status-code";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const username = req.query.username;

  const results = await user.findOnByUsername(username);

  res.status(STATUS_CODE.SUCCESS).json(results);
}

async function patchHandler(req, res) {
  const username = req.query.username;
  const userInputValues = req.body;

  const results = await user.update(username, userInputValues);

  res.status(STATUS_CODE.SUCCESS).json(results);
}
