import { createRouter } from "next-connect";

import { STATUS_CODE } from "/types/status-code";

import controller from "infra/controller";
import boilermaking from "models/boilermaking";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const token = req.cookies[process.env.COOKIE_NAME];
  const code = req.query.code;
  const sessionObject = await session.findOneValidByToken(token);

  const results = await boilermaking.findOnByCode(
    sessionObject.token_protheus,
    code,
  );

  await controller.setSessionCookie(res, sessionObject.token);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.SUCCESS).json(results);
}
