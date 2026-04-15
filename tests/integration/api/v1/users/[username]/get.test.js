import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

const PATH_URL = "/api/v1/users";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET '/api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With case mismatch", async () => {
      const objectUser = {
        username: "new user Case Different",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const response = await orchestrator.fetchToExecute({
        path: `${PATH_URL}/${objectUser.username.toLowerCase()}`,
        method: "GET",
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: createUser.id,
        username: createUser.username,
        password: createUser.password,
        created_at: createUser.created_at.toISOString(),
        updated_at: createUser.updated_at.toISOString(),
      });
    });
    test("With exact case match", async () => {
      const objectUser = {
        username: "new user Same Case",
        password: "senhaTest123",
      };

      const createUser = await orchestrator.createUser(objectUser);

      const response = await orchestrator.fetchToExecute({
        path: `${PATH_URL}/${objectUser.username}`,
        method: "GET",
      });

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: createUser.id,
        username: createUser.username,
        password: createUser.password,
        created_at: createUser.created_at.toISOString(),
        updated_at: createUser.updated_at.toISOString(),
      });
    });
    test("With noneexistent username", async () => {
      const objectUser = {
        username: "new user inexistent",
        password: "senhaTest123",
      };

      const response = await orchestrator.fetchToExecute({
        path: `${PATH_URL}/${objectUser.username}`,
        method: "GET",
      });

      expect(response.status).toBe(STATUS_CODE.NOT_FOUND);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Username informado sem cadastrado no sistema.",
        action: "Utilize outro username para realizar o consulta no sistema.",
        status_code: STATUS_CODE.NOT_FOUND,
      });
    });
  });
});
