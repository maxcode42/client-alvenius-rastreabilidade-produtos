import { useMemo, useState } from "react";
import * as Icons from "lucide-react";

import LayoutPage from "components/layout-page";
import Separator from "components/ui/separator";
import ButtonPanel from "components/ui/button-panel";
import PanelDefault from "components/ui/panel-default";
import ButtonSubMenuPanel from "components/ui/button-sub-menu-panel";

import { ITENS_MENU } from "types/menu-itens/index-sub-menus";

import withAuth from "../auth/auth-with";

function HomeButtons() {
  const [loading, setLoading] = useState(false);
  const [currentButton, setCurrentButton] = useState(null);

  const itens = useMemo(() => {
    return ITENS_MENU;
  }, []);

  return (
    <LayoutPage>
      <PanelDefault>
        <div className="w-full">
          <h3 className="text-2xl text-center font-semibold py-4">
            Clique no que deseja fazer
          </h3>
        </div>
        <Separator />

        {itens?.map((list, index) => (
          <div
            key={index}
            className={`w-full h-1/2 flex flex-col sm:flex-row gap-4 ${list.classCss}`}
          >
            {list.item.map((i) => {
              const Icon = Icons[i?.icon];

              return (
                <div
                  key={i?.key.concat(index)}
                  className={`w-full sm:w-1/2 ${i?.submenu ? "h-56 min-h-56 mb-2" : "min-h-28 h-28 md:h-56 md:min-h-56 md:flex md:flex-col md:justify-center md:item-center"}`}
                >
                  {!i.submenu ? (
                    <ButtonPanel
                      key={i?.key}
                      href={i?.href}
                      text={i?.text}
                      title={i.text}
                      target={i?.target}
                      disabled={i?.key === currentButton && loading}
                      onClick={() => (
                        setLoading(true), setCurrentButton(i?.key)
                      )}
                      className={`${i?.key === currentButton && loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                    >
                      {i?.key === currentButton && loading ? (
                        <div className="flex flex-row w-full h-16 justify-center items-center gap-2">
                          <span className="w-6 h-6 border-2 border-stone-100 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <span className="flex flex-col justify-center items-center">
                          <span className="text-sm">
                            {Icon && <Icon className="size-8" />}
                          </span>
                        </span>
                      )}
                      {i?.name}
                    </ButtonPanel>
                  ) : (
                    <ButtonSubMenuPanel
                      key={String(index).concat(i?.key)}
                      disabled={i?.key === currentButton && loading}
                    >
                      <div className="flex flex-col w-full justify-center itens-center">
                        <span className="flex flex-col justify-center items-center">
                          <span className="text-sm">
                            {Icon && <Icon className="size-8" />}
                          </span>
                        </span>

                        <div className="flex flex-col justify-center itens-center w-full">
                          <p className="text-lg text-center">{i.name}</p>
                          <p className="text-xs sm:text-sm normal-case font-normal text-center">
                            <small>{i.text}</small>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row w-full justify-between gap-2">
                        {i.submenu.map((sub) => {
                          const IconSub = Icons[sub?.icon];
                          const subSplit = sub.key.split("-");

                          const urlSub = function () {
                            if (subSplit[1] === "factory") return sub?.href;

                            if (subSplit[2] === "create") {
                              return `/transfer/${subSplit[2]}?params=${subSplit[0]}`;
                            } else {
                              return `/transfer?params=${subSplit[0]}`;
                            }
                          };

                          return (
                            <ButtonPanel
                              key={sub?.key}
                              // href={sub?.href}
                              href={urlSub()}
                              text={sub?.text}
                              title={sub?.text}
                              target={sub?.target}
                              disabled={sub?.key === currentButton && loading}
                              onClick={() => (
                                setLoading(true), setCurrentButton(sub?.key)
                              )}
                              className={`${sub?.key === currentButton && loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""} max-h-24 w-1/2 text-sm rounded-md`}
                            >
                              {sub?.key === currentButton && loading ? (
                                <div className="flex flex-row w-full h-16 justify-center items-center gap-2">
                                  <span className="w-6 h-6 border-2 border-stone-100 border-t-transparent rounded-full animate-spin" />
                                </div>
                              ) : (
                                <span className="flex flex-col justify-center items-center">
                                  <span className="text-sm">
                                    {IconSub && <IconSub className="size-8" />}
                                  </span>
                                </span>
                              )}
                              {sub?.name}
                            </ButtonPanel>
                          );
                        })}
                      </div>
                    </ButtonSubMenuPanel>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </PanelDefault>
    </LayoutPage>
  );
}

export default withAuth(HomeButtons);
