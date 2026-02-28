import { dispatchUnauthorized } from "auth/auth-events";
import { STATUS_CODE } from "types/status-code";

async function handleSend(path, method, dataObject) {
  const response = await fetch(`/api/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: dataObject ? JSON.stringify(dataObject) : null,
  });

  const responseBody = await handlerResponse(response);

  return responseBody;
}

async function handlerResponse(response) {
  if (response.status === STATUS_CODE.UNAUTHORIZED) {
    dispatchUnauthorized();
  }

  return await response.json();
}

const execute = {
  session: {
    create: async ({ data }) => {
      return await handleSend("sessions", "POST", data);
    },
    delete: async () => {
      return await handleSend("sessions", "DELETE", null);
    },
  },
  user: {
    read: async () => {
      return await handleSend("user", "GET", null);
    },
  },
  register: {
    create: async ({ data }) => {
      return await handleSend("register", "POST", data);
    },
  },
  boilerShop: {
    read: async () => {
      return await handleSend("boiler-shop", "GET", null);
    },
    create: async ({ data }) => {
      return await handleSend(`boiler-shop/`, "POST", data);
    },
    find: async ({ params }) => {
      return await handleSend(`boiler-shop/${params}`, "GET", null);
    },
  },
};

const api = {
  execute,
};

export default api;
