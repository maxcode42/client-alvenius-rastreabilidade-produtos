import * as Icons from "lucide-react";

import Body from "../components/body";
import Header from "../components/header";
import Separator from "components/ui/separator";
import ButtonPanel from "components/ui/button-panel";
import PanelDefault from "components/ui/panel-default";
import { useEffect, useMemo, useState } from "react";

import withAuth from "../auth/auth-with";
import { ITENS_MENU } from "types/menu-itens";
import Button from "components/ui/button";
import MenuSelect from "components/ui/modal/menu-select";
import LayoutPage from "components/layout-page";

function HomeModal() {
  const [loading, setLoading] = useState(false);
  const [currentButton, setCurrentButton] = useState(null);
  const itensMenu = ["boilermaking", "coating", "painting"];
  const [openModalMenuSelect, setOpenModalMenuSelect] = useState(false);

  const itens = useMemo(() => {
    return ITENS_MENU;
  }, []);

  const itensMenuTransfer = {
    boilermaking: {
      name: "Revestimento",
      icon: "SprayCanIcon",
    },
    coating: {
      name: "Pintura",
      icon: "PaintRollerIcon",
    },
    painting: {
      name: "Faturamento",
      icon: "ReceiptIcon",
    },
  };

  const itensMenuSelect = useMemo(() => {
    return itens.reduce((acc, group) => {
      group.item.filter((item) => {
        if (itensMenu.includes(item.key)) {
          item = {
            ...item,
            href: {
              pathname: `/transfer`,
              query: {
                params: item.key,
              },
            },
            text: `${item.name} / listar e criar nova transferência`,
            next: itensMenuTransfer[item.key],
          };

          return acc.push({ ...group, item });
        }
      });
      return acc;
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleButton(e) {
    e.preventDefault();

    setOpenModalMenuSelect(true);
  }

  function buttonType(item) {
    const Icon = Icons[item?.icon];
    const Icon2 = Icons[item?.next?.icon];
    const buttonSelect = {
      button: (
        <Button
          key={item?.key}
          title={item?.text}
          disabled={item?.key === currentButton && loading}
          onClick={() => {
            !openModalMenuSelect
              ? (setOpenModalMenuSelect(true),
                setLoading(true),
                setCurrentButton(item?.key))
              : (setLoading(true),
                setCurrentButton(item?.key),
                handleButton(item?.href));
          }}
          className={`
            flex flex-col w-full h-28 py-4 rounded-sm text-lg text-center  
            gap-2 justify-center items-center text-blue-950 font-semibold uppercase
            border-blue-950/50 border-2 bg-stone-100-700  
            hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600/50 hover:shadow-md
            transition mt-0
            ${item?.key === currentButton && loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
        >
          {item?.key === currentButton && loading ? (
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
          {item?.name}
          <p className="text-xs sm:text-sm normal-case font-normal">
            {item?.text}
          </p>
        </Button>
      ),
      link: (
        <ButtonPanel
          key={item?.key}
          href={item?.href}
          text={item?.text}
          title={item?.text}
          target={item?.target}
          disabled={item?.key === currentButton && loading}
          onClick={() => (setLoading(true), setCurrentButton(item?.key))}
          className={`${item?.key === currentButton && loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
        >
          {item?.key === currentButton && loading ? (
            <div className="flex flex-row w-full h-16 justify-center items-center gap-2">
              <span className="w-6 h-6 border-2 border-stone-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !item?.next ? (
            <span>
              <span className="flex flex-col justify-center items-center">
                <span className="text-sm">
                  {Icon && <Icon className="size-8" />}
                </span>
              </span>
              {item?.name}
            </span>
          ) : (
            <div className="flex flex-row justify-center items-center w-full px-2">
              <div className="flex flex-col items-center min-w-24 max-w-24">
                <span className="flex flex-col justify-center items-center">
                  <icon className="text-sm">
                    {Icon && <Icon className="size-8" />}
                  </icon>
                </span>
                <span className="text-sm">{item?.name}</span>
              </div>
              <div className="flex flex-col items-center min-w-24 max-w-24">
                <span className="flex flex-col justify-center items-center">
                  <icon className="text-sm">
                    {<Icons.MoveRightIcon className="size-8" />}
                  </icon>
                </span>
              </div>
              <div className="flex flex-col items-center min-w-24 max-w-24">
                <span className="flex flex-col justify-center items-center">
                  <icon className="text-sm">
                    {Icon2 && <Icon2 className="size-8" />}
                  </icon>
                </span>
                <span className="text-sm">{item?.next?.name}</span>
              </div>
            </div>
          )}
        </ButtonPanel>
      ),
    };

    return buttonSelect[item?.type || "link"];
  }

  useEffect(() => {}, [openModalMenuSelect]);

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
            className={`w-full h-1/2 flex flex-col lg:flex-row gap-2 ${list.classCss}`}
          >
            {list.item.map((i) => (
              <div
                // key={item?.key.concat(index)}
                key={i?.key}
                className="w-full lg:w-1/2 h-32 bg-red"
              >
                {buttonType(i)}
              </div>
            ))}
          </div>
        ))}
      </PanelDefault>
      {openModalMenuSelect && (
        <MenuSelect
          title={"Selecione qual processo de TRANSFERÊNCIA"}
          openAlert={openModalMenuSelect}
          actionClose={() => {
            setOpenModalMenuSelect(false),
              setLoading(false),
              setCurrentButton(null);
          }}
        >
          {itensMenuSelect?.map((i) => (
            <div
              key={String(i?.item?.key).concat("-modal")}
              className="w-full h-32"
            >
              {buttonType(i.item)}
            </div>
          ))}
        </MenuSelect>
      )}
    </LayoutPage>
  );
}

export default withAuth(HomeModal);
