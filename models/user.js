import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors";

async function runInsertQuery(userInputValues) {
  const results = await database.query({
    text: `
          INSERT INTO 
            users (username, password)
          VALUES
            ($1, $2)
          RETURNING
            *
        ;`,
    values: [userInputValues.username, userInputValues.password],
  });

  return results.rows[0];
}
async function runUpdateQuery(userWithNewValues) {
  const results = await database.query({
    text: `
          UPDATE
            users
          SET
            username = $2,
            password = $4,
            updated_at = timezone('utc', now())
          WHERE
            id = $1
          RETURNING
            *
          ;
        `,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.password,
    ],
  });

  return results.rows[0];
}

async function runSelectQueryUsername(username) {
  const results = await database.query({
    text: `
         SELECT
            *
          FROM
            users 
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT 
            1
        ;`,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Username informado sem cadastrado no sistema.",
      action: "Utilize outro username para realizar o consulta no sistema.",
    });
  }

  return results.rows[0];
}

async function runSelectQueryUserId(id) {
  const results = await database.query({
    text: `
         SELECT
            *
          FROM
            users 
          WHERE
            id = $1
          LIMIT 
            1
        ;`,
    values: [id],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Username informado sem cadastrado no sistema.",
      action: "Utilize outro username para realizar o consulta no sistema.",
    });
  }

  return results.rows[0];
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
         SELECT
            username
          FROM
            users 
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT 
            1
        ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Username informado já cadastrado no sistema.",
      action: "Utilize outro username para realizar está operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

async function findOnByUsername(username) {
  const result = await runSelectQueryUsername(username);

  return result;
}

async function findOnById(id) {
  const result = await runSelectQueryUserId(id);

  return result;
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const result = await runInsertQuery(userInputValues);

  return result;
}

async function update(username, userInputValues) {
  const currentUser = await runSelectQueryUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const result = await runUpdateQuery(userWithNewValues);

  return result;
}

const user = {
  findOnByUsername,
  findOnById,
  create,
  update,
};

export default user;
