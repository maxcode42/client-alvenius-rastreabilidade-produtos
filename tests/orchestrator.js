import retry from "async-retry";
import crypto from "node:crypto";

import database from "infra/database";
import migrator from "models/migrator";

import session from "models/session";
import user from "models/user";

import { STATUS_CODE } from "types/status-code";

const COOKIE_NAME = process.env.COOKIE_NAME;

function getBaseURL() {
  return process.env.API_BASE_URL;
}

async function waitForAllServices() {
  await waitForWebServer();

  function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 100,
      maxTimeout: 1_000,
    });

    async function fetchStatusPage() {
      const response = await fetchToExecute({ path: "/api/v1/status" });

      if (response.status !== STATUS_CODE.SUCCESS) {
        throw Error();
      }
    }
  }
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function fetchToExecute({
  path = "",
  params = "",
  method = "GET",
  object,
  token,
}) {
  const baseURL = getBaseURL();

  const response = await fetch(`${baseURL}${path}${params}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Cookie: !token ? null : `${COOKIE_NAME}=${token}`,
    },
    body: !object ? null : JSON.stringify(object),
  });

  return response;
}

async function createRegisterObject() {
  const objectDefaultRegister = {
    spool: {
      codigo: "SP041500345003",
      descricao: "CARRETEL FS+FF 20POL X 6,35 X 2961MM 150 PSI",
    },
    itens: [
      {
        codigo: "TJPLPL50K000311",
        fornecedor: "005436",
        fluxo: "teste tubo",
        descricao:
          "TUBO ASTM A134 PL 508MM X 6,30MM ASTM A 283 GRC DIMENSOES CONF.ASME B 36.10",
        quantidade: 1.32,
      },
      {
        codigo: "FLW21224113Z211",
        fornecedor: "005436",
        fluxo: "teste FS",
        descricao:
          "Flange solto, 20pol, face plana, dimensões conforme AWWA C 207 TAB.2 CLASSE D",
        quantidade: 1,
      },
    ],
  };

  return objectDefaultRegister;
}

async function createRegister({ token, data }) {
  const response = await fetchToExecute({
    path: "/api/v1/register",
    method: "POST",
    object: data,
    token,
  });

  const responseBody = await response.json();

  return responseBody;
}

async function findRegister({ route, token, params }) {
  // console.log(">>FIND REGISTER");
  // console.log({ path: `/${route}/${params}`, params, token });

  const response = await fetchToExecute({
    params: `/[${params}]`,
    path: `/api/v1/${route}`,
    method: "GET",
    token,
  });

  const responseBody = await response.json();

  return responseBody.data[0];
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function createSession(userId) {
  const tokenProtheus = crypto.randomBytes(48).toString("hex");

  const result = await session.create(userId, tokenProtheus);

  return result;
}

async function createAuth(username, password) {
  const response = await fetchToExecute({
    path: "/api/v1/sessions",
    method: "POST",
    object: {
      username: !username ? process.env.USERNAME_TEST : username,
      password: !password ? process.env.PASSWORD_TEST : password,
    },
  });
  const responseBody = await response.json();

  return responseBody;
}

async function createUser(objectUser) {
  const fakerObjectUser = {
    username: objectUser?.username || "default_valid_username",
    password: objectUser?.password || "default_valid_password",
  };

  const result = await user.create(fakerObjectUser);

  return result;
}

const orchestrator = {
  createRegisterObject,
  runPendingMigrations,
  waitForAllServices,
  fetchToExecute,
  createRegister,
  createSession,
  clearDatabase,
  findRegister,
  createUser,
  createAuth,
};

export default orchestrator;
