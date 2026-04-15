import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";
import user from "models/user";
import { STATUS_CODE } from "types/status-code";

const API_BASE_URL = process.env.API_BASE_URL;

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

async function fetchToExecute({ path, method, object }) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: !object ? null : JSON.stringify(object),
  });

  return response;
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function createUser(objectUser) {
  const result = await user.create(objectUser);

  return result;
}

const orchestrator = {
  runPendingMigrations,
  waitForAllServices,
  fetchToExecute,
  clearDatabase,
  createUser,
};

export default orchestrator;
