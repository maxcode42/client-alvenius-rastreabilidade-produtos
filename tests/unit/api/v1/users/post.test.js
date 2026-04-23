import user from "models/user";
import handler from "pages/api/v1/users";

import { v4 as uuidv4, version as uuidVersion } from "uuid";

import { STATUS_CODE } from "types/status-code";
import { ValidationError } from "infra/errors";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";

jest.mock("models/user");

const PATH_URL = "/api/v1/users";

describe("POST '/api/v1/users' (controller unit)", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const objectUser = {
        username: "new user",
        password: "senhaTest123",
      };

      const mockResponse = {
        id: uuidv4(),
        username: "new user",
        password: "hashed-password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      user.create.mockResolvedValue(mockResponse);

      const request = createRequest({
        method: "POST",
        url: PATH_URL,
        headers: {},
        body: objectUser,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(user.create).toHaveBeenCalledWith(objectUser);
      expect(response.status).toBe(STATUS_CODE.CREATE);

      const responseBody = await response.json();

      expect(responseBody.id).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(uuidVersion(responseBody.id)).toBe(
        Number(process.env.UUID_VERSION),
      );

      expect(responseBody).toEqual({
        id: mockResponse.id,
        username: mockResponse.username,
        password: mockResponse.password,
        created_at: mockResponse.created_at,
        updated_at: mockResponse.updated_at,
      });
    });
    test("With duplicated `username`", async () => {
      const objectUser = {
        username: "new user",
        password: "senhaTest123",
      };

      const mockResponse = new ValidationError({
        message: "Username informado já cadastrado no sistema.",
        action: "Utilize outro username para realizar está operação.",
      });

      user.create.mockRejectedValue(mockResponse);

      const request = createRequest({
        method: "POST",
        url: PATH_URL,
        headers: {},
        body: objectUser,
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(user.create).toHaveBeenCalledWith(objectUser);
      expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username informado já cadastrado no sistema.",
        action: "Utilize outro username para realizar está operação.",
        status_code: STATUS_CODE.BAD_REQUEST,
      });
    });
  });
});
