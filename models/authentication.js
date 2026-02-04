import user from "models/user";
import password from "models/password";
import { UnauthorizedError, NotFoundError } from "infra/errors";

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se o dado enviado está correto.",
    });
  }
}

async function findUserByUsername(providedUsername) {
  try {
    const result = await user.findOnByUsername(providedUsername);

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Username não confere.",
        action: "Verifique se o dado enviado está correto.",
      });
    }
    throw error;
  }
}

async function getAuthenticateUser(providedUsername, providedPassword) {
  try {
    const result = await findUserByUsername(providedUsername);
    await validatePassword(providedPassword, result.password);

    return result;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }
}

const authentication = {
  getAuthenticateUser,
};

export default authentication;
