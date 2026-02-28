import { dispatchUnauthorized } from "auth/auth-events";
import { STATUS_CODE } from "types/status-code";

async function handlerSend(path, method, dataObject) {
  const response = await fetch(`/api/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });

  const responseBody = await handleResponse(response);

  return responseBody;
}

async function handleResponse(response) {
  if (response.status === STATUS_CODE.UNAUTHORIZED) {
    dispatchUnauthorized();
  }

  return await response.json();
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

async function sendBoilerShop({ data }) {
  console.log(">> WEB API");
  console.log(data);

  const results = await handlerSend(`boiler-shop/`, "POST", data);

  return results;
}

const api = {
  findOnByCodeBoilerShop,
  sendBoilerShop,
  createRegister,
  createSession,
  deleteSession,
  getBoilerShop,
  getUser,
};

export default api;
