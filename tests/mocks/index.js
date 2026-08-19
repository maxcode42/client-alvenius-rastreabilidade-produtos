export const mockedUseAuth = jest.fn();

jest.mock("auth/auth-context", () => ({
  useAuth: mockedUseAuth,
}));

export const mockedUseQRCode = jest.fn();

jest.mock("hooks/qr-code-context", () => ({
  useQRCode: mockedUseQRCode,
}));

export const mockQRCodeBase = (overrides = {}) => {
  return mockedUseQRCode.mockReturnValue({
    setQrCodeReadingType: jest.fn(),
    setScannerLocked: jest.fn(),
    setCurrentSpool: jest.fn(),
    setOpenAlert: jest.fn(),
    setMessage: jest.fn(),
    setOpenQRCode: jest.fn(),
    setResult: jest.fn(),
    setCheckCodeExists: jest.fn(),
    setCurrentProcess: jest.fn(),
    setOnClose: jest.fn(),
    setAction: jest.fn(),

    openQRCodeBase: false,
    openQRCode: false,
    openAlert: false,
    message: null,

    ...overrides,
  });
};

export const startMock = jest.fn().mockResolvedValue(undefined);

jest.mock("html5-qrcode", () => ({
  Html5Qrcode: jest.fn().mockImplementation(() => ({
    start: startMock,
    stop: jest.fn(),
    clear: jest.fn(),
  })),
}));
