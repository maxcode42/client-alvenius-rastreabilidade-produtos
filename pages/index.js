// "use client";
import PanelDefault from "components/ui/panel-default";
import ButtonsMenu from "components/ui/buttons-menu";
import LayoutPage from "components/layout-page";
import Separator from "components/ui/separator";

import { useMenu } from "hooks/menu-context";

import withAuth from "../auth/auth-with";

function Home() {
  const { itens } = useMenu();
  const renderType = {
    link: "panel",
    button: "button",
  };
  return (
    <LayoutPage>
      <PanelDefault>
        <div className="w-full">
          <h3 className="text-2xl text-center font-semibold py-4">
            Clique no que deseja fazer
          </h3>
        </div>
        <Separator />

        <ul className="flex flex-col w-full min-w-full">
          {itens?.defaults?.map((l, index) => (
            <li
              key={index}
              className={`w-full h-1/2 flex flex-col lg:flex-row gap-2 ${l.classCss}`}
            >
              {l?.item?.map((item, index) => (
                <div
                  key={`${item?.key}-${index}`}
                  className="w-full lg:w-1/2 h-32 bg-red"
                >
                  <ButtonsMenu
                    item={item}
                    renderType={renderType[item.type ?? "button"]}
                  />
                </div>
              ))}
            </li>
          ))}
        </ul>
      </PanelDefault>
    </LayoutPage>
  );
}

export default withAuth(Home);
