import retry from "async-retry";
import {
  InternalServerError,
  NotFoundError,
  ServiceError,
  UnauthorizedError,
} from "infra/errors";
import { PROCESS_FLOW } from "types/process-flow";
import { STATUS_CODE } from "types/status-code";

import { getProtheusBaseURL, isTestEnvironment } from "infra/config/env";

function fetchWithTimeout(url, options = {}, timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
}

async function handleSend(path, method, dataObject, token) {
  try {
    return await retry(fetchExternalAPI, {
      retries: isTestEnvironment() ? 1 : 10,
      minTimeout: 100,
      maxTimeout: 1000,
    });
  } catch (error) {
    console.error("[PROTHEUS FINAL ERROR]", error.message);

    throw new ServiceError({
      cause: error,
      message: "Falha na comunicação com API externa.",
    });
  }
  async function fetchExternalAPI(attempt) {
    const getBaseURL = getProtheusBaseURL();
    const protheusStatusAPI = path === "status";
    const normalizedPath = protheusStatusAPI ? "" : path;
    try {
      const response = await fetchWithTimeout(
        `${getBaseURL}/${normalizedPath}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: dataObject ? JSON.stringify(dataObject) : null,
        },
        3000,
      );

      return await handlerResponse(response, protheusStatusAPI);
    } catch (error) {
      console.log(`[RETRY] tentativa ${attempt} falhou`);
      throw error;
    }
  }
}

async function handlerResponse(response, protheusStatusAPI) {
  try {
    if (
      response.status !== STATUS_CODE.UNAUTHORIZED &&
      response.status !== STATUS_CODE.SUCCESS &&
      response.status !== STATUS_CODE.CREATE
    ) {
      throw new NotFoundError({
        message: "Um error interno inesperado ocorreu na request externa.",
        action: "Contate suporte tecnico.",
      });
    }

    if (response.status === STATUS_CODE.SUCCESS && protheusStatusAPI) {
      const responseBodyDefault = {
        status_code: Number(response?.status),
        message: "Status comunicação realizado com api externa.",
      };

      return responseBodyDefault;
    }

    const responseBody = await response?.json();

    if (Number(responseBody?.status_code) === STATUS_CODE.UNAUTHORIZED) {
      throw new UnauthorizedError({
        message: `PROTHEUS API => ${responseBody?.message}`,
        action: "Verifique se os dados de login enviados estão corretos.",
      });
    }

    if (Number(responseBody?.status_code) === STATUS_CODE.NOT_FOUND) {
      throw new NotFoundError({
        message: `PROTHEUS API => ${responseBody?.message}`,
        action: "Verifique se os dados enviados estão corretos ou cadastrado.",
      });
    }

    if (
      Number(responseBody?.status_code) === STATUS_CODE.SERVER_ERROR ||
      Number(responseBody?.code) === STATUS_CODE.SERVER_ERROR
    ) {
      throw new InternalServerError({
        message: `PROTHEUS API => ${responseBody?.message}`,
        action:
          "Ocorreu erro no servidor de API do Protheus, entre contato suporte.",
      });
    }

    //FOI RECOMENDADO RETORNO DE UM ARRAY VAZIO,
    //mas equipe interna definiu esse retorno JSON de ERROR
    if (Number(responseBody?.status_code) === STATUS_CODE.NOT_ALLOWED) {
      return { objects: [] };
    }

    if (Number(responseBody?.status_code) === STATUS_CODE.CREATE) {
      const responseBodyDefault = {
        status_code: Number(responseBody?.status_code),
        message: responseBody?.message,
      };

      return responseBodyDefault;
    }

    return responseBody;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new NotFoundError({
        message: `PROTHEUS API => ${response?.message}`,
        action: "Error no retorno dados API Protheus.",
      });
    }

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
  status: {
    get: async () => {
      return await handleSend("status", "GET", null, null);
    },
  },
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
      return await handleSend("wsrastreio", "POST", data, tokenProtheus);
    },
    status: async ({ tokenProtheus }) => {
      return await handleSend("wsrastreio", "GET", null, tokenProtheus);
    },
  },
  boilermaking: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/process?${PROCESS_FLOW.route.boilermaking.acronym}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("wsrastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  coating: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/process?${PROCESS_FLOW.route.coating.acronym}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("wsrastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  painting: {
    read: async ({ tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/process?${PROCESS_FLOW.route.painting.acronym}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("wsrastreio/new", "POST", data, tokenProtheus);
    },
    find: async ({ params, tokenProtheus }) => {
      return await handleSend(
        `wsrastreio/id?${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  supplier: {
    read: async ({ tokenProtheus, params }) => {
      return await handleSend(
        `wsrastreio/list_fornec?process=${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
  },
  transfer: {
    read: async ({ tokenProtheus, params }) => {
      return await handleSend(
        `wsrastreio/listrom?process=${params}`,
        "GET",
        null,
        tokenProtheus,
      );
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("wsrastreio/list", "POST", data, tokenProtheus);
    },
  },
};

const apiProtheus = {
  execute,
};

export default apiProtheus;
