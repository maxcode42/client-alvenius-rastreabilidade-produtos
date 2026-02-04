import { Client } from "pg";

import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const results = await client.query(queryObject);

    return results;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com banco dados ou na query.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();

  return client;
}

const database = {
  getNewClient,
  query,
};

export default database;
