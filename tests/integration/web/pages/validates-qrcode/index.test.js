import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "libs/test-utils";

import { mockedUseAuth, mockQRCodeBase, startMock } from "tests/mocks/index.js";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/validates-qrcode",
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}));

import ValidatesQrcode from "pages/validates-qrcode";

describe("QRCode page rendering and functionalities (Page)", () => {
  const signInMock = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: {
        id: 1,
        username: "user_name",
      },
      isAuthenticated: true,
      signIn: signInMock,
      logout: jest.fn(),
    });

    mockQRCodeBase();
  });

  describe("Authenticated user", () => {
    test("should render the QRCode page", () => {
      mockQRCodeBase({
        openQRCodeBase: false,
        openQRCode: false,
        openAlert: false,
        message: null,
      });

      render(<ValidatesQrcode />);

      expect(screen.getByText(/Leitor de QRCode/i)).toBeVisible();
      expect(
        screen.getByText(/Ler o QRCode do Spool e Componentes/i),
      ).toBeVisible();
      expect(
        screen.getByText(/Verificar os campos e dados, validar o QRCode/i),
      ).toBeVisible();

      expect(screen.getByRole("button", { name: /ler qrcode/i })).toBeVisible();
      expect(screen.getByRole("button", { name: /fechar/i })).toBeVisible();

      expect(screen.getByText(/último qrcode lido:/i)).toBeVisible();
      expect(screen.getByText(/aguardando leitura/i)).toBeVisible();
    });

    test("should render QRCode camera container when active", () => {
      mockQRCodeBase({
        openQRCodeBase: true,
        openQRCode: true,
      });

      render(<ValidatesQrcode />);

      expect(screen.getByTestId("qr-reader")).toBeInTheDocument();
      expect(startMock).toHaveBeenCalledTimes(1);
    });

    test("should open QRCode camera when clicking 'Ler QRCode'", async () => {
      const setOpenQRCodeMock = jest.fn();

      mockQRCodeBase({
        openQRCodeBase: false,
        openQRCode: false,
        setOpenQRCode: setOpenQRCodeMock,
      });

      render(<ValidatesQrcode />);

      const button = screen.getByRole("button", { name: /ler qrcode/i });

      await user.click(button);

      expect(setOpenQRCodeMock).toHaveBeenCalledTimes(1);
      expect(setOpenQRCodeMock).toHaveBeenCalledWith(true);

      mockQRCodeBase({
        openQRCodeBase: true,
        openQRCode: true,
      });

      await waitFor(() => {
        const readers = screen.getAllByTestId("qr-reader");
        expect(readers).toHaveLength(1);
      });
    });

    test("should not start camera automatically in initial state", () => {
      mockQRCodeBase({
        openQRCodeBase: false,
        openQRCode: false,
      });

      render(<ValidatesQrcode />);

      expect(startMock).not.toHaveBeenCalled();
    });
  });
});
