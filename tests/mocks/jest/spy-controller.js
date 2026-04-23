import controller from "infra/controller";

export function setupControllerSpy(session) {
  return jest
    .spyOn(controller, "setSessionCookie")
    .mockImplementation((res, token) => {
      res.setHeader("Set-Cookie", [
        `${process.env.COOKIE_NAME}=${token}; Max-Age=${
          session.EXPIRATION_IN_MILLISECONDS / 1000
        }; Path=/; HttpOnly`,
      ]);
    });
}
