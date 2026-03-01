import { createRouter } from "next-connect";

import { STATUS_CODE } from "/types/status-code";

import controller from "infra/controller";
import boilermaking from "models/boilermaking";
import session from "models/session";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);

  //const renewedSessionObject = await session.renew(sessionObject.id);

  const results = await boilermaking.findAll(sessionObject.token_protheus);

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
  const boilermakingInputValues = req.body;
  const token = req.cookies[process.env.COOKIE_NAME];
  console.log(">>BACKEND CONTROLLER");
  console.log(boilermakingInputValues);
  const sessionObject = await session.findOneValidByToken(token);

  const renewedSessionObject = await session.renew(sessionObject.id);

  const results = await boilermaking.create(
    boilermakingInputValues,
    renewedSessionObject.token_protheus,
  );

  await controller.setSessionCookie(res, renewedSessionObject.token);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.CREATE).json(results);
}
