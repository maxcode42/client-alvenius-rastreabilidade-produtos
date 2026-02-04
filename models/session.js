import crypto from "node:crypto";

import database from "infra/database";
import { UnauthorizedError } from "infra/errors";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1_000; // 30 days in milliseconds

function createDateExpiresAt() {
  const result = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS); // add 30 day

  return result;
}

async function runInsertQuery(userId, token, expiresAt) {
  const results = await database.query({
    text: `
      INSERT INTO
        sessions (user_id, token, expires_at)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
    ;`,
    values: [userId, token, expiresAt],
  });

  return results.rows[0];
}

async function runUpdateQuery(id, expiresAt) {
  const results = await database.query({
    text: `
      UPDATE
        sessions
      SET
        expires_at = $2,
        updated_at = NOW()
      WHERE
        id = $1
      RETURNING
        *
    ;`,
    values: [id, expiresAt],
  });

  return results.rows[0];
}

async function runUpdateQueryId(id) {
  const results = await database.query({
    text: `
      UPDATE
        sessions
      SET
        expires_at = expires_at - interval '1 year',
        updated_at = NOW()
      WHERE
        id = $1
      RETURNING
        *
    ;`,
    values: [id],
  });

  return results.rows[0];
}

async function runSelectQuery(token) {
  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        sessions
      WHERE
        token = $1
      AND
        expires_at > NOW()
      LIMIT
        1
    ;`,
    values: [token],
  });

  if (results.rowCount === 0) {
    throw new UnauthorizedError({
      message: "Usuário não possui uma sessão ativa.",
      action: "Verifique se esse usuário esta logado e tente novamente.",
    });
  }

  return results.rows[0];
}

async function findOneValidByToken(token) {
  const result = await runSelectQuery(token);

  return result;
}

async function expireById(id) {
  const result = await runUpdateQueryId(id);

  return result;
}

async function create(userId) {
  const expiresAt = createDateExpiresAt();
  const token = crypto.randomBytes(48).toString("hex");

  const result = await runInsertQuery(userId, token, expiresAt);

  return result;
}

async function renew(id) {
  const expiresAt = createDateExpiresAt();
  const result = await runUpdateQuery(id, expiresAt);

  return result;
}

const session = {
  EXPIRATION_IN_MILLISECONDS,
  findOneValidByToken,
  expireById,
  create,
  renew,
};

export default session;
