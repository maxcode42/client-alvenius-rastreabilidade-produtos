const { STATUS_CODE } = require("types/status-code");

function createHttpMock() {
  let statusCode;
  let responseBody;

  const headers = {};
  const cookies = [];

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

  function serialize(data) {
    if (data instanceof Error) return normalizeError(data);

    if (Array.isArray(data)) return data.map(serialize);

    if (data && typeof data === "object") {
      return Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, serialize(v)]),
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
      responseBody = serialize(data);
      return res;
    }),

    setHeader: jest.fn((key, value) => {
      const k = key.toLowerCase();

      if (k === "set-cookie") {
        const values = Array.isArray(value) ? value : [value];
        cookies.push(...values);
        headers[k] = cookies;
        return;
      }

      headers[k] = value;
    }),

    getHeader: jest.fn((key) => headers[key.toLowerCase()]),

    end: jest.fn(),
  };

  async function execute(handler, req) {
    try {
      res.__req = req;
      req.cookies = req.cookies || {};

      await handler(req, res);

      // fallback realista Next.js
      if (!statusCode) {
        statusCode = STATUS_CODE.SUCCESS;
      }
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

    getHeaders() {
      return headers;
    },

    get headers() {
      return {
        ...headers,
        get(key) {
          return headers[key.toLowerCase()];
        },
      };
    },
  };
}

module.exports = { createHttpMock };
