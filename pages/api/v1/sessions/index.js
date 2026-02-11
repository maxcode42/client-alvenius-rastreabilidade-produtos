import { createRouter } from "next-connect";

import { STATUS_CODE } from "types/status-code";

import controller from "infra/controller";

import authentication from "models/authentication";
import session from "models/session";

const router = createRouter();

router.post(postHandler);
router.delete(deleteHandler);
export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const userInputValues = req.body;

  const authenticatedUser = await authentication.getAuthenticateUser(
    userInputValues.username,
    userInputValues.password,
  );

  const result = await session.create(
    authenticatedUser.id,
    authenticatedUser.token_protheus,
  );

  await controller.setSessionCookie(res, result.token);

  res.status(STATUS_CODE.CREATE).json(result);
}

async function deleteHandler(req, res) {
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);
  const expiredSession = await session.expireById(sessionObject.id);

  await controller.clearSessionCookie(res);

  res.status(STATUS_CODE.SUCCESS).json(expiredSession);
}
