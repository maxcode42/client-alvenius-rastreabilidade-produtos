import orchestrator from "tests/orchestrator";
import { STATUS_CODE } from "types/status-code";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST `/api/v1/migrations`", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          `${process.env.API_BASE_URL}/api/v1/migrations`,
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(STATUS_CODE.CREATE);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response = await fetch(
          `${process.env.API_BASE_URL}/api/v1/migrations`,
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(STATUS_CODE.SUCCESS);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBe(0);
      });
    });
  });
});
