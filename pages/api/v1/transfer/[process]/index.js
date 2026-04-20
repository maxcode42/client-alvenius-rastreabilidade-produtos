import { createRouter } from "next-connect";

import { STATUS_CODE } from "/types/status-code";

import controller from "infra/controller";
import transfer from "models/transfer";
import session from "models/session";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const params = req?.query?.process;
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);

  const results = await transfer.findAll(sessionObject.token_protheus, params);

  if (results === true) {
    await controller.clearSessionCookie(res);

    res.status(STATUS_CODE.SUCCESS).json(sessionObject.id);
  }

  await controller.setSessionCookie(res, sessionObject.token);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.SUCCESS).json(results);
}

async function postHandler(req, res) {
  const params = req?.query?.process;
  const transferInputValues = req.body;
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);

  const results = await transfer.create(
    sessionObject.token_protheus,
    transferInputValues,
    params,
  );
  await controller.setSessionCookie(res, sessionObject.token);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.CREATE).json(results);
}
