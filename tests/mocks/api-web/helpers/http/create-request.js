function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const [key, ...rest] = pair.split("=");
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});
}

function createRequest({
  method = "GET",
  url = "/",
  body = {},
  headers = {},
  query,
  routePattern,
}) {
  const parsedUrl = new URL(url, "http://localhost");

  // QUERY
  const parsedQuery =
    query || Object.fromEntries(parsedUrl.searchParams.entries());

  // PARAMS (se você já implementou antes)
  let params = {};
  if (routePattern) {
    const urlSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const routeSegments = routePattern.split("/").filter(Boolean);

    params = routeSegments.reduce((acc, segment, index) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const key = segment.slice(1, -1);
        acc[key] = urlSegments[index];
      }
      return acc;
    }, {});
  }

  // COOKIE PARSE
  const rawCookie = headers.Cookie || headers.cookie || "";

  const cookies = parseCookies(rawCookie);

  return {
    method,
    url,
    headers,
    body,
    query: { ...parsedQuery, ...params },
    cookies,
  };
}

module.exports = { createRequest };
