import retry from "async-retry";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";
import { PROCESS_FLOW } from "types/process-flow";
import { STATUS_CODE } from "types/status-code";

import { getProtheusBaseURL, isTestEnvironment } from "infra/config/env";

function getBaseURL() {
  const url = getProtheusBaseURL();
  console.log(">>PROCESS");
  console.log(url);

  return url;
}

async function handleSend(path, method, dataObject, token) {
  return await waitForWebServer();

  function waitForWebServer() {
    const isTest = isTestEnvironment();
    //const isTest = !!process.env.JEST_WORKER_ID; //process.env.NODE_ENV === "development";
    console.log(">> IN TEST");
    console.log(isTest);

    return retry(fetchExternalAPI, {
      retries: isTest ? 1 : 100,
      maxTimeout: 1_000,
      minTimeout: 60,
    });

    async function fetchExternalAPI() {
      const protheusStatusAPI = path === "status";

      const normalizedPath = protheusStatusAPI ? "" : path;
      console.log(">> STATUS EXTERNO DEPOIS DO IF");
      console.log(`${getBaseURL()}/${normalizedPath}`);

      const response = await fetch(`${getBaseURL()}/${normalizedPath}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: dataObject ? JSON.stringify(dataObject) : null,
      });

      const result = await handlerResponse(response, protheusStatusAPI);

      return result;
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
      console.log("EXCUTE STATUS");
      // return {
      //   response: {
      //     status_code: Number(response?.status),
      //     message: "Status comunicação realizado com api externa.",
      //   },
      // };
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
      const results = await handleSend(
        `wsrastreio/listrom?process=${params}`,
        "GET",
        null,
        tokenProtheus,
      );
      console.log(results);
      return results;
    },
    create: async ({ data, tokenProtheus }) => {
      return await handleSend("wsrastreio/list", "POST", data, tokenProtheus);
    },
    // find: async ({ params, tokenProtheus }) => {
    //   return await handleSend(
    //     `wsrastreio/id?${params}`,
    //     "GET",
    //     null,
    //     tokenProtheus,
    //   );
    // },
  },
};

const apiProtheus = {
  execute,
};

export default apiProtheus;

/*
 "CODIGO": "000001",
          "SPOOL": "SP041500345003 ",
          "FORNECEDOR": "005436",
          "LOJA": "01",
          "NUM_SC": "      ", // STATUS EM TRANSITO  e PROCESSO Aguardando SC  EM BRANCO | PRECHIDO STATUS EM TRANSITO  e PROCESSO Aguardando pedido
          "PEDIDO": "      ", // PRECHIDO PEDIDO STATUS EM TRANSITO  e PROCESSO Aguardando romaneio
          "ROMANEIO": "      ", // PRECHIDO ROMANEIO STATUS EM TRANSITO  e PROCESSO Aguardando nota
          "REVISAO": "  ",
          "AET": "S",
          "PROCESSO": "CA"

    JSON:  {
      "CODIGO": "000001",
      "SPOOL": ["SP041500345003 ", "SP041500345003 "],
      "FORNECEDOR": "005436",
      "LOJA": "01",
      "NUM_SC": "      ",
      "PEDIDO": "      ",
      "ROMANEIO": "      ",
      "REVISAO": "  ",
      "NOTA": "",
      "SERIE": "",
      "AET": "S",
      "PROCESSO": "CA",
      "STATUS": ["SC", "PD", "RO"],
      "STATUS_MESSAGE": ["Aguardando SC", "Aguardando Pedido", "Aguardando Romaneio"
    },
*/
