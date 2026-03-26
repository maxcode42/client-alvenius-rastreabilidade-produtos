import * as Icons from "lucide-react";

import Body from "../components/body";
import Header from "../components/header";
import Separator from "components/ui/separator";
import ButtonPanel from "components/ui/button-panel";
import PanelDefault from "components/ui/panel-default";
import { useMemo, useState } from "react";

import withAuth from "../auth/auth-with";
import { ITENS_MENU } from "types/menu-itens";

function Home() {
  const [loading, setLoading] = useState(false);
  const [currentButton, setCurrentButton] = useState(null);

  const itens = useMemo(() => {
    return ITENS_MENU;
  }, []);

  return (
    <div className="w-full h-full bg-stone-100">
      <Header />

      <Body>
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
                    className="w-full sm:w-1/2 h-32"
                  >
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
                  </div>
                );
              })}
            </div>
          ))}
        </PanelDefault>
      </Body>
    </div>
  );
}

export default withAuth(Home);
