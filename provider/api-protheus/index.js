const baseURL = process.env.API_PROTHEUS_BASE_URL;

async function handlerSend(path, method, dataObject, token) {
  const response = await fetch(`${baseURL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });

  const responseBody = await response.json();

  return responseBody;
}

async function createRegister({ data, tokenProtheus }) {
  const results = await handlerSend("WSRASTREIO", "POST", data, tokenProtheus);

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

const apiProtheus = {
  createRegister,
  sendAuthenticateUser,
};

export default apiProtheus;
