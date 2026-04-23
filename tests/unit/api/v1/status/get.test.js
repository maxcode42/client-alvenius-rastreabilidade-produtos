import database from "infra/database";
import apiProtheus from "infra/provider/api-protheus";

import handler from "pages/api/v1/status";

import { STATUS_CODE } from "types/status-code";
import { InternalServerError, NotFoundError } from "infra/errors";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

jest.mock("infra/database");
jest.mock("infra/provider/api-protheus");
jest.spyOn(console, "error").mockImplementation(() => {});

const PATH_URL = "/api/v1/status";
const MAX_OPENED_CONNECTIONS_IN_TEST = 1;
const POSTGRES_DB_MAX_CONNECTIONS = 100;
const POSTGRES_DB_VERSION = "16.0";

describe("GET '/api/v1/status' (controller unit)", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      database.query
        .mockResolvedValueOnce({
          rows: [{ server_version: POSTGRES_DB_VERSION }],
        })
        .mockResolvedValueOnce({
          rows: [{ max_connections: POSTGRES_DB_MAX_CONNECTIONS }],
        })
        .mockResolvedValueOnce({
          rows: [{ count: MAX_OPENED_CONNECTIONS_IN_TEST }],
        });

      apiProtheus.execute.status.get.mockResolvedValue({
        status_code: STATUS_CODE.SUCCESS,
        message: "Status comunicação realizado com api externa.",
      });

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(responseBody.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

      expect(responseBody.dependencies.database.version).toBe(
        POSTGRES_DB_VERSION,
      );
      expect(responseBody.updated_at).toBe(parsedUpdatedAt);

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            version: POSTGRES_DB_VERSION,
            max_connections: parseInt(POSTGRES_DB_MAX_CONNECTIONS),
            opened_connections: MAX_OPENED_CONNECTIONS_IN_TEST,
          },
          integration: {
            api_external: {
              erp: {
                status_code: STATUS_CODE.SUCCESS,
                message: "Status comunicação realizado com api externa.",
              },
            },
          },
        },
      });
    });
    test("With API external failure", async () => {
      const mockError = new NotFoundError({
        message: "Um error interno inesperado ocorreu na request externa.",
        action: "Contate suporte tecnico.",
      });

      database.query
        .mockResolvedValueOnce({
          rows: [{ server_version: POSTGRES_DB_VERSION }],
        })
        .mockResolvedValueOnce({
          rows: [{ max_connections: POSTGRES_DB_MAX_CONNECTIONS }],
        })
        .mockResolvedValueOnce({
          rows: [{ count: MAX_OPENED_CONNECTIONS_IN_TEST }],
        });

      apiProtheus.execute.status.get.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(responseBody.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

      expect(responseBody.dependencies.database.version).toBe(
        POSTGRES_DB_VERSION,
      );
      expect(responseBody.updated_at).toBe(parsedUpdatedAt);

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            version: POSTGRES_DB_VERSION,
            max_connections: parseInt(POSTGRES_DB_MAX_CONNECTIONS),
            opened_connections: MAX_OPENED_CONNECTIONS_IN_TEST,
          },
          integration: {
            api_external: {
              erp: {
                status_code: STATUS_CODE.NOT_FOUND,
                name: "NotFoundError",
                message:
                  "Um error interno inesperado ocorreu na request externa.",
                action: "Contate suporte tecnico.",
              },
            },
          },
        },
      });
    });
    test("With database failure", async () => {
      const mockError = new InternalServerError({
        message: "Um error interno inesperado ocorreu.",
        action: "Entre em contato com suporte.",
      });

      database.query.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SERVER_ERROR);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "InternalServerError",
        message: "Um error interno inesperado ocorreu.",
        action: "Entre em contato com suporte.",
        status_code: STATUS_CODE.SERVER_ERROR,
      });

      //  expect(responseBody).toEqual({
      //    updated_at: responseBody.updated_at,
      //    dependencies: {
      //      database: {
      //        version: POSTGRES_DB_VERSION,
      //        max_connections: parseInt(POSTGRES_DB_MAX_CONNECTIONS),
      //        opened_connections: MAX_OPENED_CONNECTIONS_IN_TEST,
      //      },
      //      integration: {
      //        api_external: {
      //          erp: {
      //            status_code: STATUS_CODE.NOT_FOUND,
      //            message:
      //              "Um error interno inesperado ocorreu na request externa.",
      //          },
      //        },
      //      },
      //    },
      //  });
    });
    test("With API Protheus failure returning error.toJSON()", async () => {
      const mockError = new NotFoundError({
        message: "Um error interno inesperado ocorreu na request externa.",
        action: "Contate suporte tecnico.",
      });

      database.query
        .mockResolvedValueOnce({
          rows: [{ server_version: POSTGRES_DB_VERSION }],
        })
        .mockResolvedValueOnce({
          rows: [{ max_connections: POSTGRES_DB_MAX_CONNECTIONS }],
        })
        .mockResolvedValueOnce({
          rows: [{ count: MAX_OPENED_CONNECTIONS_IN_TEST }],
        });

      apiProtheus.execute.status.get.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(responseBody.dependencies.integration.api_external.erp).toEqual({
        name: "NotFoundError",
        message: "Um error interno inesperado ocorreu na request externa.",
        action: "Contate suporte tecnico.",
        status_code: STATUS_CODE.NOT_FOUND,
      });
    });
    test("With API Protheus failure returning raw error (no toJSON)", async () => {
      const mockError = new Error("Erro inesperado sem padronização.");

      database.query
        .mockResolvedValueOnce({
          rows: [{ server_version: POSTGRES_DB_VERSION }],
        })
        .mockResolvedValueOnce({
          rows: [{ max_connections: POSTGRES_DB_MAX_CONNECTIONS }],
        })
        .mockResolvedValueOnce({
          rows: [{ count: MAX_OPENED_CONNECTIONS_IN_TEST }],
        });

      apiProtheus.execute.status.get.mockRejectedValue(mockError);

      const request = createRequest({
        method: "GET",
        url: PATH_URL,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();
      expect(responseBody.dependencies.integration.api_external.erp).toEqual({
        name: "Error",
        message: "Erro inesperado sem padronização.",
        action: "Contate suporte tecnico.",
        status_code: 500,
      });
    });
  });
});
