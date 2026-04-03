import { dispatchUnauthorized } from "auth/auth-events";
import { PROCESS_FLOW } from "types/process-flow";
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
  if (
    response.status === STATUS_CODE.UNAUTHORIZED ||
    response.status === STATUS_CODE.NOT_FOUND
  ) {
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
      return await handleSend(PROCESS_FLOW.route.register.name, "POST", data);
    },
  },
  boilermaking: {
    read: async () => {
      return await handleSend(
        PROCESS_FLOW.route.boilermaking.name,
        "GET",
        null,
      );
    },
    create: async ({ data }) => {
      return await handleSend(
        PROCESS_FLOW.route.boilermaking.name,
        "POST",
        data,
      );
    },
    find: async ({ params }) => {
      return await handleSend(
        `${PROCESS_FLOW.route.boilermaking.name}/${params}`,
        "GET",
        null,
      );
    },
  },
  coating: {
    read: async () => {
      return await handleSend(PROCESS_FLOW.route.coating.name, "GET", null);
    },
    create: async ({ data }) => {
      return await handleSend(PROCESS_FLOW.route.coating.name, "POST", data);
    },
    find: async ({ params }) => {
      return await handleSend(
        `${PROCESS_FLOW.route.coating.name}/${params}`,
        "GET",
        null,
      );
    },
  },
  painting: {
    read: async () => {
      return await handleSend(PROCESS_FLOW.route.painting.name, "GET", null);
    },
    create: async ({ data }) => {
      return await handleSend(PROCESS_FLOW.route.painting.name, "POST", data);
    },
    find: async ({ params }) => {
      return await handleSend(
        `${PROCESS_FLOW.route.painting.name}/${params}`,
        "GET",
        null,
      );
    },
  },
  supplier: {
    read: async (params) => {
      // return await handleSend(`${PROCESS_FLOW.route.supplier.name}/${params}`, "GET", null);
      return await handleSend(
        `${PROCESS_FLOW.route.supplier.name}/${params}`,
        "GET",
        null,
      );
    },
  },
  transfer: {
    read: async (params) => {
      // return await handleSend(`${PROCESS_FLOW.route.supplier.name}/${params}`, "GET", null);
      return await handleSend(
        `${PROCESS_FLOW.route.transfer.name}/${params}`,
        "GET",
        null,
      );
    },
    create: async ({ data, params }) => {
      return await handleSend(
        `${PROCESS_FLOW.route.transfer.name}/${params}`,
        "POST",
        data,
      );
    },
    // find: async ({ params }) => {
    //   return await handleSend(
    //     `${PROCESS_FLOW.route.supplier.name}/${params}`,
    //     "GET",
    //     null,
    //   );
    // },
  },
};

const api = {
  execute,
};

export default api;
