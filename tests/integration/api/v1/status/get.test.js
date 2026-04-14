import { STATUS_CODE } from "types/status-code";

const MAX_OPENED_CONNECTIONS_IN_TEST = 1;
const POSTGRES_DB_MAX_CONNECTIONS = 100;
const POSTGRES_DB_VERSION = "16.0";

beforeAll(async () => {
  console.log(">> BEFOREALL");
});

describe("GET '/api/v1/status'", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${process.env.API_BASE_URL}/api/v1/status`);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(responseBody.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

      expect(responseBody.updated_at).toBe(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toBe(
        POSTGRES_DB_VERSION,
      );

      expect(responseBody.dependencies.database.max_connections).toBe(
        POSTGRES_DB_MAX_CONNECTIONS,
      );

      expect(responseBody.dependencies.database.opened_connections).toBe(
        MAX_OPENED_CONNECTIONS_IN_TEST,
      );
    });
  });
});
