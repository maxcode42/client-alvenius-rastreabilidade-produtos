import userEvent from "@testing-library/user-event";
import { render, screen } from "libs/test-utils";

import { mockedUseAuth } from "tests/mocks/index.js";

import Login from "pages/login";
import { STATUS_CODE } from "types/status-code";

describe("Login (Page)", () => {
  const signInMock = jest.fn();
  const user = userEvent.setup();
  const userName = process.env.USERNAME_TEST;
  const userPassword = process.env.PASSWORD_TEST;

  function renderLogin() {
    render(<Login />);

    return {
      inputName: screen.getByLabelText(/usuário/i),
      inputPassword: screen.getByLabelText(/senha/i),
      buttonLogin: screen.getByRole("button", {
        name: /entrar/i,
      }),
    };
  }

  async function fillLoginForm(username = userName, password = userPassword) {
    await user.type(screen.getByLabelText(/usuário/i), username);
    await user.type(screen.getByLabelText(/senha/i), password);
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: signInMock,
      logout: jest.fn(),
    });
  });

  describe("Default user", () => {
    test("should render login form", () => {
      const { inputName, inputPassword, buttonLogin } = renderLogin();

      expect(inputName).toBeVisible();
      expect(inputPassword).toBeVisible();
      expect(buttonLogin).toBeVisible();
      expect(buttonLogin).toBeEnabled();
    });

    test("with valid session and form submission success", async () => {
      const { inputName, inputPassword, buttonLogin } = renderLogin();

      await fillLoginForm();

      expect(inputName).toHaveValue(userName);
      expect(inputPassword).toHaveValue(userPassword);

      await user.click(buttonLogin);

      expect(signInMock).toHaveBeenCalledTimes(1);

      expect(signInMock).toHaveBeenCalledWith(
        expect.objectContaining({
          username: userName,
          password: userPassword,
        }),
      );
    });

    test("should show validation messages when fields are empty", async () => {
      const { buttonLogin } = renderLogin();

      await user.click(buttonLogin);

      expect(
        screen.getByText(/usuário deve conter formato válido/i),
      ).toBeVisible();

      expect(screen.getByText(/campo senha não pode ser vazio/i)).toBeVisible();

      expect(signInMock).not.toHaveBeenCalled();
    });

    test("should show loading state when submitting form", async () => {
      signInMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 200)),
      );

      const { buttonLogin } = renderLogin();

      await fillLoginForm();

      await user.click(buttonLogin);

      expect(screen.getByText(/entrando/i)).toBeVisible();
      expect(buttonLogin).toBeDisabled();
    });

    test("should prevent multiple submissions while loading", async () => {
      let resolveSignIn;

      signInMock.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveSignIn = resolve;
          }),
      );

      const { buttonLogin } = renderLogin();

      await fillLoginForm();

      await user.click(buttonLogin);
      await user.click(buttonLogin);

      expect(signInMock).toHaveBeenCalledTimes(1);

      resolveSignIn({
        status_code: STATUS_CODE.SUCCESS,
      });
    });

    test("should show unauthorized messages when login fails", async () => {
      signInMock.mockResolvedValue({
        status_code: STATUS_CODE.UNAUTHORIZED,
        message: "Usuário inválido",
        action: "Senha inválida",
      });

      const { buttonLogin } = renderLogin();

      await fillLoginForm("wrong_user", "wrong_pass");

      await user.click(buttonLogin);

      expect(await screen.findByText(/usuário inválido/i)).toBeVisible();

      expect(await screen.findByText(/senha inválida/i)).toBeVisible();

      expect(signInMock).toHaveBeenCalledTimes(1);
    });

    test("should show generic error when signIn throws exception", async () => {
      signInMock.mockRejectedValue(new Error("Server error"));

      const { buttonLogin } = renderLogin();

      await fillLoginForm();

      await user.click(buttonLogin);

      expect(await screen.findByText(/erro ao realizar login/i)).toBeVisible();

      expect(signInMock).toHaveBeenCalledTimes(1);
    });
  });
});
