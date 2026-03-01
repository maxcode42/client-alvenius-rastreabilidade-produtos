import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";
import { STATUS_CODE } from "types/status-code";

const baseURL = process.env.API_PROTHEUS_BASE_URL;

async function handleSend(path, method, dataObject, token) {
  const response = await fetch(`${baseURL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });

  return await handlerResponse(response);
}

async function handlerResponse(response) {
  try {
    const responseBody = await response.json();

    if (Number(responseBody?.Status_Code) === STATUS_CODE.UNAUTHORIZED) {
      throw new UnauthorizedError({
        message: `PROTHEUS API => ${responseBody?.Message}`,
        action: "Verifique se os dados de login enviados estão corretos.",
      });
    }

    if (Number(responseBody?.Status_Code) === STATUS_CODE.NOT_FOUND) {
      throw new NotFoundError({
        message: `PROTHEUS API => ${responseBody?.Message}`,
        action: "Verifique se os dados enviados estão corretos ou cadastrado.",
      });
    }

    if (Number(responseBody?.Status_Code) === STATUS_CODE.SERVER_ERROR) {
      throw new InternalServerError({
        message: `PROTHEUS API => ${responseBody?.Message}`,
        action:
          "Ocorreu erro no servidor de API do Protheus, entre contato suporte.",
      });
    }

    if (Number(responseBody?.Status_Code) === STATUS_CODE.CREATE) {
      const responseBodyDefault = {
        status_code: Number(responseBody?.Status_Code),
        message: responseBody?.Message,
      };

      return responseBodyDefault;
    }

    return responseBody;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: error?.message,
        action: error?.action,
      });
    }

    if (error instanceof NotFoundError) {
      throw new NotFoundError({
        message: error?.message,
        action: error?.action,
      });
    }

    if (error instanceof InternalServerError) {
      throw new InternalServerError({
        message: error?.message,
        action: error?.action,
      });
    }

    throw error;
  }
}

const execute = {
  session: {
    create: async ({ data }) => {
      const params = new URLSearchParams(data);
      return await handleSend(
        `api/oauth2/v1/token?${params}`,
        "POST",
        null,
        null,
      );
    },
  },
  register: {
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("WSRASTREIO", "POST", data, tokenProtheus);
    },
    status: async ({ tokenProtheus }) => {
      return await handleSend("WSRASTREIO", "GET", null, tokenProtheus);
    },
  },
  boilermaking: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        "WSRASTREIO/process?CA",
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("WsRastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `WSRASTREIO/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  coating: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        "WSRASTREIO/process?CA",
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("WsRastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `WSRASTREIO/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  painting: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        "WSRASTREIO/process?CA",
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("WsRastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `WSRASTREIO/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
};

const apiProtheus = {
  execute,
};

export default apiProtheus;
