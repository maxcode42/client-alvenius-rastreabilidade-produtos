import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

import { STATUS_CODE } from "types/status-code";

import password from "models/password";
import user from "models/user";

const PATH_URL = "/api/v1/users";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST '/api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const objectUser = {
        username: "new user",
        password: "senhaTest123",
      };

      const response = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: objectUser,
      });

      expect(response.status).toBe(STATUS_CODE.CREATE);

      const responseBody = await response.json();

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: objectUser.username,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      // USER IN DATABASE IS COMPARE PASSWORD
      const userInDatabase = await user.findOnByUsername(objectUser.username);

      const currectPasswordMatch = await password.compare(
        objectUser.password,
        userInDatabase.password,
      );

      expect(currectPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "senhaErrada",
        objectUser.password,
      );

      expect(incorrectPasswordMatch).toBe(false);
    });
    test("With duplicated `username`", async () => {
      const objectUser_01 = {
        username: "new user duplicated",
        password: "senhaTest123",
      };

      const objectUser_02 = {
        username: "New User Duplicated",
        password: "senhaTest123",
      };

      const response_01 = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: objectUser_01,
      });

      expect(response_01.status).toBe(STATUS_CODE.CREATE);

      const response_02 = await orchestrator.fetchToExecute({
        path: PATH_URL,
        method: "POST",
        object: objectUser_02,
      });

      expect(response_02.status).toBe(STATUS_CODE.BAD_REQUEST);

      const response_02_Body = await response_02.json();

      expect(response_02_Body).toEqual({
        name: "ValidationError",
        message: "Username informado já cadastrado no sistema.",
        action: "Utilize outro username para realizar está operação.",
        status_code: STATUS_CODE.BAD_REQUEST,
      });
    });
  });
});
