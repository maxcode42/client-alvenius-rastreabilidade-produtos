import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";
import { STATUS_CODE } from "types/status-code";

const baseURL = process.env.API_PROTHEUS_BASE_URL;

async function handlerSend(path, method, dataObject, token) {
  try {
    const response = await fetch(`${baseURL}/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: dataObject ? JSON.stringify(dataObject) : null,
    });
    const responseBody = await response?.json();

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

async function createRegister({ data, tokenProtheus }) {
  const results = await handlerSend("WSRASTREIO", "POST", data, tokenProtheus);

  return results;
}

async function getRegisterStatus({ tokenProtheus }) {
  const results = await handlerSend("WSRASTREIO", "GET", null, tokenProtheus);

  return results;
}

async function sendAuthenticateUser({ data }) {
  const params = new URLSearchParams(data);

  const results = await handlerSend(
    `api/oauth2/v1/token?${params}`,
    "POST",
    data,
    null,
  );

  return results;
}

async function findAllBoilerShop({ tokenProtheus }) {
  const results = await handlerSend(
    `WSRASTREIO/process?CA`,
    "GET",
    null,
    tokenProtheus,
  );
  // console.log(">>API PROTHEUS");
  // console.log(results);
  // const results = [
  //   {
  //     codigo: "SP50K000311",
  //     status: "reservado",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  //   {
  //     codigo: "SP5EK000311",
  //     status: "execução",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  //   {
  //     codigo: "SP7EK000456",
  //     status: "sucata",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  //   {
  //     codigo: "SP46K000322",
  //     status: "reservado",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  //   {
  //     codigo: "SP44K000122",
  //     status: "reservado",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  //   {
  //     codigo: "SP66K000544",
  //     status: "finalizado",
  //     descricao:
  //       "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
  //   },
  // ];

  return results;
}

async function findOnByCode({ tokenProtheus, code }) {
  const results = await handlerSend(
    `WSRASTREIO/id?${code}`,
    "GET",
    null,
    tokenProtheus,
  );

  return results;
}

const apiProtheus = {
  sendAuthenticateUser,
  getRegisterStatus,
  findAllBoilerShop,
  createRegister,
  findOnByCode,
};

export default apiProtheus;
