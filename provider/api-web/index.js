async function handlerSend(path, method, dataObject) {
  const response = await fetch(`/api/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });

  const responseBody = await response.json();

  return responseBody;
}

async function createSession({ username, password }) {
  const results = await handlerSend("sessions", "POST", { username, password });

  return results;
}

async function deleteSession() {
  const results = await handlerSend("sessions", "DELETE", null);

  return results;
}

async function getUser() {
  const results = await handlerSend("user", "GET", null);

  return results;
}

async function createRegister({ data }) {
  const results = await handlerSend("register", "POST", data);

  return results;
}

async function getBoilerShop() {
  const results = await handlerSend("boiler-shop", "GET", null);

  return results;
}

async function findOnByCodeBoilerShop({ code }) {
  const results = await handlerSend(`boiler-shop/${code}`, "GET", null);

  return results;
}

const api = {
  findOnByCodeBoilerShop,
  createRegister,
  createSession,
  deleteSession,
  getBoilerShop,
  getUser,
};

export default api;
