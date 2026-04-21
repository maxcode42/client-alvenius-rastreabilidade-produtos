import user from "models/user";
import handler from "pages/api/v1/users/[username]";

import { v4 as uuidv4, version as uuidVersion } from "uuid";

import { STATUS_CODE } from "types/status-code";

import { createHttpMock } from "tests/mocks/api-web/helpers/http/create-http-mock";
import { createRequest } from "tests/mocks/api-web/helpers/http/create-request";
import { NotFoundError } from "infra/errors";

jest.mock("models/user");

const PATH_URL = "/api/v1/users";

describe("GET '/api/v1/users/[username]' (controller unit)", () => {
  describe("Anonymous user", () => {
    test("With case mismatch", async () => {
      const objectUser = {
        username: "new user Case Different",
        password: "senhaTest123",
      };

      const mockResponse = {
        id: uuidv4(),
        username: "new user",
        password: "hashed-password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      user.findOnByUsername.mockResolvedValue(mockResponse);

      const request = createRequest({
        method: "GET",
        url: `${PATH_URL}/${objectUser.username.toLowerCase()}`,
        query: {
          username: objectUser.username.toLowerCase(),
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

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
    test("With exact case match", async () => {
      const objectUser = {
        username: "new user Case Different",
        password: "senhaTest123",
      };

      const mockResponse = {
        id: uuidv4(),
        username: "new user",
        password: "hashed-password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      user.findOnByUsername.mockResolvedValue(mockResponse);

      const request = createRequest({
        method: "GET",
        url: `${PATH_URL}/${objectUser.username}`,
        query: {
          username: objectUser.username,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

      expect(response.status).toBe(STATUS_CODE.SUCCESS);

      const responseBody = await response.json();

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
    test("With noneexistent username", async () => {
      const objectUser = {
        username: "new user inexistent",
        password: "senhaTest123",
      };

      const mockResponse = new NotFoundError({
        message: "Username informado sem cadastrado no sistema.",
        action: "Utilize outro username para realizar o consulta no sistema.",
      });

      user.findOnByUsername.mockRejectedValue(mockResponse);

      const request = createRequest({
        method: "GET",
        url: `${PATH_URL}/${objectUser.username}`,
        query: {
          username: objectUser.username,
        },
      });

      const response = createHttpMock();

      await response.execute(handler, request);

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
