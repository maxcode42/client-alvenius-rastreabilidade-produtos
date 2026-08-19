import "@testing-library/jest-dom";

import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
});

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}

/* Router mocks globais*/
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

/* Camera API (global) */
if (!global.navigator.mediaDevices) {
  Object.defineProperty(global.navigator, "mediaDevices", {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
    configurable: true,
  });
}

expect.extend({});
