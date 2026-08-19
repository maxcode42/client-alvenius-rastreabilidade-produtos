import migrator from "models/migrator";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import handler from "pages/api/v1/migrations";

import { STATUS_CODE } from "types/status-code";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

jest.mock("node-pg-migrate", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("infra/database", () => ({
  getNewClient: jest.fn(),
}));

const PATH_URL = "/api/v1/migrations";

const mockDbClient = {
  end: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();

  database.getNewClient.mockResolvedValue(mockDbClient);

  migrationRunner.mockResolvedValue([
    { name: "migration-001" },
    { name: "migration-002" },
  ]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET '/api/v1/migrations' (controller unit)", () => {
  describe("Anonymous user", () => {
    describe("Retrieving pending migrations", () => {
      test("Be greater than zero", async () => {
        const request = await createRequest({
          path: PATH_URL,
          method: "GET",
        });

        const response = createHttpMock();

        await response.execute(handler, request);

        expect(response.status).toBe(STATUS_CODE.SUCCESS);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });
      test("Should always close db connection even if migration fails", async () => {
        database.getNewClient.mockResolvedValue(mockDbClient);

        migrationRunner.mockRejectedValueOnce(new Error("migration error"));

        await expect(migrator.listPendingMigrations()).rejects.toThrow(
          "migration error",
        );

        expect(mockDbClient.end).toHaveBeenCalledTimes(1);
      });
    });
  });
});
