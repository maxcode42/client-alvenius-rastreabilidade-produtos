const { STATUS_CODE } = require("types/status-code");

function createHttpMock() {
  let statusCode;
  let responseBody;
  const headers = {};
  const cookies = []; // suporte a múltiplos cookies

  // normalização centralizada de erro (delegando ao padrão do infra/errors)
  function normalizeError(error) {
    if (error instanceof Error && typeof error.toJSON === "function") {
      return error.toJSON();
    }

    if (error instanceof Error) {
      return {
        name: error.name || "InternalServerError",
        message: error.message || "Internal server error",
        action: "Contate suporte tecnico.",
        status_code: error.statusCode || STATUS_CODE.SERVER_ERROR,
      };
    }

    return {
      name: "InternalServerError",
      message: "Internal server error",
      action: "Contate suporte tecnico.",
      status_code: STATUS_CODE.SERVER_ERROR,
    };
  }

  // serialização recursiva segura
  function serialize(data) {
    if (data instanceof Error) {
      return normalizeError(data);
    }

    if (Array.isArray(data)) {
      return data.map(serialize);
    }

    if (data && typeof data === "object") {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, serialize(value)]),
      );
    }

    return data;
  }

  const res = {
    status: jest.fn((code) => {
      statusCode = code;
      return res;
    }),

    json: jest.fn((data) => {
      // TRATATIVA CENTRALIZADA
      responseBody = serialize(data);
      return res;
    }),

    setHeader: jest.fn((key, value) => {
      const normalizedKey = key.toLowerCase();

      // tratamento específico para Set-Cookie
      if (normalizedKey === "set-cookie") {
        if (Array.isArray(value)) {
          cookies.push(...value);
        } else {
          cookies.push(value);
        }
        headers[normalizedKey] = cookies;
        return;
      }

      headers[normalizedKey] = value; // evita problema de case
    }),

    end: jest.fn(),
  };

  async function execute(handler, req) {
    try {
      await handler(req, res);
    } catch (error) {
      const normalized = normalizeError(error);

      statusCode = normalized.status_code || STATUS_CODE.SERVER_ERROR;
      responseBody = normalized;
    }
  }

  return {
    execute,

    get status() {
      return statusCode;
    },
    async json() {
      return responseBody;
    },
    getHeader(key) {
      return headers[key.toLowerCase()];
    },

    // compatibilidade com libs que usam response.headers.get()
    headers: {
      get(key) {
        return headers[key.toLowerCase()];
      },
    },
  };
}

module.exports = { createHttpMock };
