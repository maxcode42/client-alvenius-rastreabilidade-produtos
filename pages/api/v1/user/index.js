import { createRouter } from "next-connect";

import user from "models/user";
import session from "models/session";
import controller from "infra/controller";
import { STATUS_CODE } from "types/status-code";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const token = req.cookies[process.env.COOKIE_NAME];

  const sessionObject = await session.findOneValidByToken(token);

  const renewedSessionObject = await session.renew(sessionObject.id);

  const result = await user.findOnById(sessionObject.user_id);

  await controller.setSessionCookie(res, renewedSessionObject.token);

  // Desativa o cache do navegador obrigando a carregar dados em todas requisições
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  res.status(STATUS_CODE.SUCCESS).json(result);
}
