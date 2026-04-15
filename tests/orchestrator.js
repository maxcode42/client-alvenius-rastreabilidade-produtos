import retry from "async-retry";
import crypto from "node:crypto";

import database from "infra/database";
import migrator from "models/migrator";

import session from "models/session";
import user from "models/user";

import { STATUS_CODE } from "types/status-code";

const API_BASE_URL = process.env.API_BASE_URL;
const COOKIE_NAME = process.env.COOKIE_NAME;

async function waitForAllServices() {
  await waitForWebServer();

  function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 100,
      maxTimeout: 1_000,
    });

    async function fetchStatusPage() {
      const response = await fetch(`${API_BASE_URL}/api/v1/status`);

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
};

export default orchestrator;
