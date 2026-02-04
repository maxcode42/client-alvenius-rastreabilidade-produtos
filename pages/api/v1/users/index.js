import { createRouter } from "next-connect";

import user from "models/user";
import controller from "infra/controller";
import { STATUS_CODE } from "/types/status-code";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const userInputValues = req.body;

  const results = await user.create(userInputValues);

  res.status(STATUS_CODE.CREATE).json(results);
}
