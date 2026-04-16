// function createFetchMock({ status = 200, body = {}, headers = {} } = {}) {
//   console.log(">>MOCK");
//   return jest.fn().mockResolvedValue({
//     status,
//     headers,
//     json: async () => body,
//   });
// }

// function createFetchReject(error) {
//   return jest.fn().mockRejectedValue(error);
// }

// module.exports = {
//   createFetchMock,
//   createFetchReject,
// };

let originalFetch;

function getOriginalFetch() {
  if (!originalFetch) {
    if (typeof global.fetch !== "function") {
      throw new Error("global.fetch não está disponível");
    }
    originalFetch = global.fetch;
  }
  return originalFetch;
}

function isExternalRequest(input) {
  try {
    const url = typeof input === "string" ? input : input?.url || "";

    const parsed = new URL(url);

    const hostname = parsed.hostname;

    return !(
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    );
  } catch {
    return false;
  }
}

function createResponse({ status, body }) {
  let consumed = false;

  return {
    status,
    ok: status >= 200 && status < 300,

    clone() {
      return createResponse({ status, body });
    },

    async json() {
      if (consumed) {
        throw new TypeError("Body is unusable");
      }
      consumed = true;
      return body;
    },

    async text() {
      if (consumed) {
        throw new TypeError("Body is unusable");
      }
      consumed = true;
      return JSON.stringify(body);
    },
  };
}

function installFetchInterceptor() {
  const original = getOriginalFetch();

  globalThis.fetch = async (input, options = {}) => {
    const external = isExternalRequest(input);

    if (!external) {
      console.log(">>MOCK");
      return original(input, options);
    }

    if (process.env.DEBUG_FETCH === "true") {
      console.log("[fetch-interceptado]:", input);
    }

    let body = {};
    try {
      body = options?.body ? JSON.parse(options.body) : {};
    } catch {
      body = {};
    }

    // ✅ sucesso
    if (body.username === "valid_user" && body.password === "valid_pass") {
      return createResponse({
        status: 201,
        body: {
          access_token: "mock-token",
          refresh_token: "mock-refresh",
          token_type: "Bearer",
          expires_in: 3600,
        },
      });
    }

    // ❌ erro
    return createResponse({
      status: 200,
      body: {
        status_code: 401,
        message: "Unauthorized",
      },
    });
  };
}

function restoreFetch() {
  if (originalFetch) {
    global.fetch = originalFetch;
  }
}

module.exports = {
  installFetchInterceptor,
  restoreFetch,
};
