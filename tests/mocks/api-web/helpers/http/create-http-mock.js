function createHttpMock() {
  let statusCode;
  let responseBody;
  const headers = {};
  const cookies = []; // suporte a múltiplos cookies

  const res = {
    status: jest.fn((code) => {
      statusCode = code;
      return res;
    }),

    json: jest.fn((data) => {
      // TRATATIVA CENTRALIZADA
      if (data instanceof Error && typeof data.toJSON === "function") {
        responseBody = data.toJSON();
      } else {
        responseBody = data;
      }

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
    await handler(req, res);
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
