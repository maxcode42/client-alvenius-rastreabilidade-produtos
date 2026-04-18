import user from "models/user";
//import password from "models/password";
import { UnauthorizedError, NotFoundError } from "infra/errors";

import apiProtheus from "infra/provider/api-protheus";

// async function validatePassword(providedPassword, storedPassword) {
//   const correctPasswordMatch = await password.compare(
//     providedPassword,
//     storedPassword,
//   );

//   if (!correctPasswordMatch) {
//     throw new UnauthorizedError({
//       message: "Senha não confere.",
//       action: "Verifique se o dado enviado está correto.",
//     });
//   }
// }

async function findUserByUsername(
  providedUsername,
  providedPassword,
  isAuthentication,
) {
  try {
    let result = await user.findOnByUsername(
      providedUsername,
      isAuthentication,
    );

    if (!result) {
      result = await user.create({
        username: providedUsername,
        password: providedPassword,
      });
    }

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

async function sendUserByUsernameProtheus(providedUsername, providedPassword) {
  const response = await apiProtheus.execute.session.create({
    data: {
      grant_type: "password",
      username: providedUsername,
      password: providedPassword,
    },
  });

  if (!response?.access_token) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se o dado enviado está correto.",
    });
  }
  const isAuthentication = !!response?.access_token;

  let getUser = await findUserByUsername(
    providedUsername,
    providedPassword,
    isAuthentication,
  );

  const results = {
    ...getUser,
    token_protheus: response.access_token,
  };

  return results;
}

async function getAuthenticateUser(providedUsername, providedPassword) {
  try {
    const results = await sendUserByUsernameProtheus(
      providedUsername,
      providedPassword,
    );

    return results;
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
