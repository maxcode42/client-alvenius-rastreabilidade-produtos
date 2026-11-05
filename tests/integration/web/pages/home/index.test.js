import userEvent from "@testing-library/user-event";
import { render, screen, within } from "libs/test-utils";

import { mockedUseAuth, mockQRCodeBase } from "tests/mocks/index.js";

import Home from "pages/index";
import { ITENS_MENU } from "types/menu-itens";

const pushMock = jest.fn();

describe("Home (Page)", () => {
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
  describe("Default user", () => {
    test("should render home with menu for valid session", async () => {
      const itensMenuFilter = ITENS_MENU.reduce((acc, group) => {
        const items = group.item.filter((item) => item.hidden !== true);

        if (items.length > 0) {
          acc.push({
            ...group,
            item: items,
          });
        }

        return acc;
      }, []);

      const itens = itensMenuFilter;
      mockQRCodeBase({
        openQRCodeBase: false,
        openQRCode: false,
        openAlert: false,
        message: null,
      });

      render(<Home />);

      expect(screen.getByText(/clique no que deseja fazer/i)).toBeVisible();
      expect(screen.getByText(/rastreio de produtos/i)).toBeVisible();

      const main = screen.getByRole("main");
      const menuItens = screen.getByRole("list");
      const items = screen.getAllByRole("listitem");

      expect(menuItens).toBeVisible();
      expect(items).toHaveLength(itens.length);

      /* eslint-disable jest/no-conditional-expect */
      itens.forEach((group) => {
        group.item.forEach(async (item) => {
          pushMock.mockClear();
          const name = new RegExp(item.name, "i");
          const element =
            within(main).queryByRole("button", { name }) ||
            within(main).queryByRole("link", { name });

          expect(element).toBeInTheDocument();
          expect(element).toBeVisible();

          if (item.type === "link") {
            expect(element).toHaveAttribute("href", item.href);
          } else {
            expect(element).toBeEnabled();

            await user.click(element);
            expect(element).not.toBeEnabled();
          }
        });
      });
    });
  });
});
