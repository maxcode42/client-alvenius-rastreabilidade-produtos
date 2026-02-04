import * as cookie from "cookie";

import session from "models/session";
import {
  InternalServerError,
  MethodNotAllowedError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "infra/errors";

function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, _, res) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return res.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(res);
    return res.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObject);
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function setSessionCookie(res, token) {
  const setCookie = cookie.serialize(process.env.COOKIE_NAME, token, {
    //expirar e exclui direto navegador
    //expires: new Date(results.expires_at),
    //define data expiração em segundos com base no relógio user
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  });

  res.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(res) {
  const setCookie = cookie.serialize(process.env.COOKIE_NAME, "invalid", {
    maxAge: -1, // define para navegador excluir cookie
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  });
  res.setHeader("Set-Cookie", setCookie);
}

const controller = {
  clearSessionCookie,
  setSessionCookie,
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
