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
      const baseURL = getBaseURL();
      const response = await fetch(`${baseURL}/api/v1/status`);

      if (response.status !== STATUS_CODE.SUCCESS) {
        throw Error();
      }
    }
  }
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function fetchToExecute({ path, method, object, token }) {
  const baseURL = getBaseURL();
  const response = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Cookie: !token ? null : `${COOKIE_NAME}=${token}`,
    },
    body: !object ? null : JSON.stringify(object),
  });

  return response;
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
  runPendingMigrations,
  waitForAllServices,
  fetchToExecute,
  createSession,
  clearDatabase,
  createUser,
  createAuth,
};

export default orchestrator;
