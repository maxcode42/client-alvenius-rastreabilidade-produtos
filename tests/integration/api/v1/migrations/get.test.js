import orchestrator from "tests/orchestrator";
import { STATUS_CODE } from "types/status-code";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET `/api/v1/migrations`", () => {
  describe("Anonymous user", () => {
    describe("Retrieving pending migrations", () => {
      test("Be greater than zero", async () => {
        const response = await fetch(
          `${process.env.API_BASE_URL}/api/v1/migrations`,
        );

        expect(response.status).toBe(STATUS_CODE.SUCCESS);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });
    });
  });
});
