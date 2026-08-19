function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) return resolve(null);

      const contentType = req.headers["content-type"] || "";

      try {
        if (contentType.includes("application/json")) {
          return resolve(JSON.parse(body));
        }

        if (contentType.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams(body);
          return resolve(Object.fromEntries(params.entries()));
        }

        return resolve(body);
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", reject);
  });
}

module.exports = { parseRequestBody };
