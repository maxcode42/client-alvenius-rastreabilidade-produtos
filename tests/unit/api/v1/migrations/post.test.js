import migrator from "models/migrator";
import handler from "pages/api/v1/migrations";

import { STATUS_CODE } from "types/status-code";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

jest.mock("models/migrator");

const PATH_URL = "/api/v1/migrations";

describe("POST '/api/v1/migrations' (controller unit)", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const mockResponse = [
          { id: "003-add-index" },
          { id: "004-alter-table" },
        ];

        migrator.runPendingMigrations.mockResolvedValue(mockResponse);

        const request = await createRequest({
          path: PATH_URL,
          method: "POST",
        });

        const response = createHttpMock();

        await response.execute(handler, request);

        expect(response.status).toBe(STATUS_CODE.CREATE);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const mockResponse = [];

        migrator.runPendingMigrations.mockResolvedValue(mockResponse);

        const request = await createRequest({
          path: PATH_URL,
          method: "POST",
        });

        const response = createHttpMock();

        await response.execute(handler, request);

        expect(response.status).toBe(STATUS_CODE.SUCCESS);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBe(0);
      });
    });
  });
});
