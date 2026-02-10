import { createRouter } from "next-connect";

import { STATUS_CODE } from "/types/status-code";

import controller from "infra/controller";
import register from "models/register";
import session from "models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const registerInputValues = req.body;
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);

  const renewedSessionObject = await session.renew(sessionObject.id);

  const results = await register.create(
    registerInputValues,
    renewedSessionObject.token_protheus,
  );

  await controller.setSessionCookie(res, renewedSessionObject.token);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.CREATE).json(results);
}
