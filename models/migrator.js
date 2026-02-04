import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "infra/database";

const defaultMigrationsOptions = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  direction: "up",
  //verbose: true, // exibe os logs
  log: () => {}, // oculta os logs
  dryRun: true,
};

async function listPendingMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const results = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    return results;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const results = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
      dbClient,
    });

    return results;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
