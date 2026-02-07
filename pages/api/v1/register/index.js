import { createRouter } from "next-connect";

import register from "models/register";
import controller from "infra/controller";
import { STATUS_CODE } from "/types/status-code";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const registerInputValues = req.body;

  const results = await register.create(registerInputValues);

  res.status(STATUS_CODE.CREATE).json(results);
}
