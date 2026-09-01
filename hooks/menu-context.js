"use client";

import { createContext, useContext, useState, useMemo } from "react";
import MenuSelect from "components/ui/modal/menu-select";
import ButtonsMenu from "components/ui/buttons-menu";

import { ITENS_MENU } from "types/menu-itens";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [itens] = useState(ITENS_MENU);
  const [loading, setLoading] = useState(false);
  const [currentButton, setCurrentButton] = useState(null);
  const [openModalMenuTypes, setOpenModalMenuTypes] = useState(false);
  const [openModalMenuProcesses, setOpenModalMenuProcesses] = useState(false);
  const renderType = {
    link: "panel",
    button: "button",
  };
  const itensMenuTransfer = {
    processes: ["boilermaking", "coating", "painting"],
    types: ["component", "spool"],
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
  const itensMenu = useMemo(() => {
    const defaults = itens.reduce((acc, group) => {
      const items = group.item.filter((item) => !item.hidden);

      if (items.length > 0) {
        acc.push({
          ...group,
          item: items,
        });
      }

      return acc;
    }, []);
    const types = itens.reduce((acc, group) => {
      group.item.filter((item) => {
        if (itensMenuTransfer.types.includes(item.key)) {
          return acc.push({ ...group, item });
        }
      });
      return acc;
    }, []);
    const processes = itens.reduce((acc, group) => {
      group.item.filter((item) => {
        if (itensMenuTransfer.processes.includes(item.key)) {
          item = {
            ...item,
            href: {
              pathname: `/transfer`,
              query: {
                params: item.key,
              },
            },
            next: itensMenuTransfer[item.key],
          };

          return acc.push({ ...group, item });
        }
      });
      return acc;
    }, []);

    return { defaults, types, processes };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      itens: itensMenu,
      setOpenModalMenuTypes,
      setOpenModalMenuProcesses,
      setCurrentButton,
      currentButton,
      setLoading,
      loading,
    }),
    [itens, currentButton],
  );

  return (
    <MenuContext.Provider value={value}>
      {children}

      {openModalMenuTypes && (
        <MenuSelect
          title={"Selecione qual TIPO de TRANSFERÊNCIA"}
          openAlert={openModalMenuTypes}
          actionClose={() => {
            setOpenModalMenuTypes(false),
              setLoading(false),
              setCurrentButton(null);
          }}
        >
          {itensMenu?.types?.map((i) => (
            <div
              key={String(i.item?.key).concat("-modal")}
              className="w-full h-32"
            >
              <ButtonsMenu
                item={i.item}
                renderType={renderType[i.item.type ?? i.item.type]}
              />
            </div>
          ))}
        </MenuSelect>
      )}

      {openModalMenuProcesses && (
        <MenuSelect
          title={"Selecione qual PROCESSO de TRANSFERÊNCIA"}
          openAlert={openModalMenuProcesses}
          actionClose={() => {
            setOpenModalMenuProcesses(false),
              setCurrentButton(null),
              setLoading(false);
          }}
        >
          {itensMenu?.processes?.map((i, index) => (
            <div
              key={String(index).concat(String(i.item?.key)).concat("-modal")}
              className="w-full h-32"
            >
              <ButtonsMenu
                item={i.item}
                renderType={renderType[i.item.type ?? "button"]}
              />
            </div>
          ))}
        </MenuSelect>
      )}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);

  if (!ctx) {
    throw new Error("useMenu must be used inside MenuProvider");
  }

  return ctx;
}
