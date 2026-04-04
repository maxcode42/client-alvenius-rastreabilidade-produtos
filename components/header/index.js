import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  XIcon,
  MenuIcon,
  UserRound,
  LogOutIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as Icons from "lucide-react";

import { ITENS_MENU } from "types/menu-itens";
import { useAuth } from "../../auth/auth-context";

// import logo from "../../assets/imagens/logo.png";

import logo from "../../assets/imagens/logo_icon.png";

export default function Header({ title }) {
  const titleDefault = title ? "Rastreio de produtos" : "";
  const currentRoute = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const itens = useMemo(() => {
    return [
      {
        classCss: "justify-center",
        item: [
          {
            name: "Início",
            href: "/",
            target: "",
            key: "inicio",
            text: "Home e menu da aplicação",
            icon: "HomeIcon",
          },
        ],
      },

      ...ITENS_MENU,
    ];
  }, []);

  async function handlerLogout(e) {
    e.preventDefault();
    signOut();
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <header className="flex flex-col w-full h-36 shadow-blue-600/50 shadow-md lg:overflow-hidden inset-0 z-10 relative lg:fixed">
      {/* <div className="w-full h-full px-16 sm:px-24 flex flex-row justify-between items-center bg-zinc-300 lg:overflow-hidden"> */}
      <div
        className="flex flex-row bg-red-200 w-full h-full px-6 lg:px-44
       flex flex-row justify-between items-center bg-zinc-300 lg:overflow-hidden"
      >
        <div className="flex flex-col w-full h-full justify-center gap-1">
          {/* <div className="w-[210px] h-8">
            <Image src={logo} alt="Logo alvenius" priority />
          </div> */}
          <div className="flex flex-row items-base h-8">
            <div className="w-[64px] h-8">
              <Image src={logo} alt="Logo alvenius" priority />
            </div>
            {title && (
              <h2 className="font-semibold text-md sm:text-2xl py-4 uppercase">
                {titleDefault}
              </h2>
            )}
          </div>
          <div className="w-32 h-8 w-[64px] px-4">
            <p className="text-sm text-stone-400">
              <small>{process.env.NEXT_PUBLIC_APP_VERSION}</small>
            </p>
          </div>
        </div>
        {user && (
          <div className="flex flex-row w-fit right-0 items-end justify-end lg:justify-center lg:items-center">
            <div className="flex flex-col items-center justify-end -mr-2 lg:-mr-18">
              <button
                className={`p-4 text-4xl flex flex-col text-right w-full lg:hidden ${open ? "hidden transition-all duration-200" : ""}`}
                onClick={() => setOpen(true)}
                type="button"
              >
                <MenuIcon className="text-blue-950/50" size={32} />
              </button>
              <button
                className={`p-4 text-4xl flex flex-col text-right w-full  lg:hidden ${!open ? "hidden transition-all duration-200" : ""}`}
                onClick={() => setOpen(false)}
                type="button"
              >
                <XIcon className="text-red-400/50" size={32} />
              </button>
            </div>
            <div
              className={`mt-40 lg:mt-0 fixed lg:relative inset-0 z-40 bg-zinc-300/95 text-zinc-900 transform transition-all 
              duration-300 ease-in-out h-[100vh] lg:h-full w-full lg:static lg:translate-x-0 lg:opacity-100 lg:bg-transparent 
              lg:pointer-events-auto overflow-y-auto max-h-dvh min-h-0 lg:max-h-none lg:overflow-hidden pb-44 lg:pb-0 ${
                open
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none"
              }
            `}
            >
              <nav
                className={`flex flex-col lg:flex-row w-full lg:gap-4 gap-2 py-8 lg:justify-center justify-end items-center`}
              >
                <div className="order-2 lg:order-1 w-full lg:w-fit flex flex-col lg:flex-row h-full items-center justify-center px-4">
                  {currentRoute !== "/" && (
                    <div className="w-full lg:w-fit flex flex-col lg:flex-row gap-2 lg:gap-4 justify-center items-center">
                      {itens?.map((list) => {
                        return list.item.map((i) => {
                          const Icon = Icons[i?.icon];
                          return (
                            <div
                              key={i.key.concat(i.name)}
                              className={`${i?.key === "site-alvenius" && "lg:hidden"} 
                                w-full lg:w-fit flex flex-col lg:flex-row justify-center items-center
                                `}
                            >
                              <Link
                                href={i?.href}
                                target={i?.target}
                                onClick={() => setOpen(false)}
                                className={`${
                                  currentRoute === i?.href
                                    ? "pointer-events-none opacity-40 cursor-not-allowed lg:border-zinc-500 font-extrabold lg:border-b-4 lg:inline-block"
                                    : "hover:text-zinc-500 cursor-pointer"
                                }  
                                      w-full lg:w-fit flex flex-row items-center justify-between lg:justify-center px-4 lg:px-0  pt-3 
                                      lg:pt-5 pb-4 lg:min-w-[${Math.min(Math.ceil(i?.name.length * 1.25), 20)}ch] lg:max-w-[${Math.min(Math.ceil(i?.name.length * 1.5), 34)}ch] shrink-0
                                      text-center text-lg lg:text-md 
                                      lg:inline-block lg:border-b-4 lg:border-transparent transition-all duration-300 
                                      hover:scale-120 hover:font-extrabold hover:border-zinc-500 
                                  `}
                              >
                                <span className="flex flex-row gap-2 items-center justify-center">
                                  <span className="lg:hidden">
                                    {Icon && (
                                      <Icon className="w-auto" size={24} />
                                    )}
                                  </span>
                                  <span className="uppercase text-center">
                                    {i?.name}
                                  </span>
                                </span>
                                <span className="lg:hidden">
                                  <ChevronRightIcon className="size-6 text-blue-950/50" />
                                </span>
                              </Link>
                              <div className="lg:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                            </div>
                          );
                        });
                      })}
                    </div>
                  )}
                </div>
                <div className="order-1 lg:order-2 w-full inline-flex justify-center items-center px-4 py-4 sm:px-0 gap-4 sm:gap-2">
                  <div className="hidden lg:block border-l-2 border-blue-950/50 w-12 h-7" />
                  <UserRound className="w-auto" size={32} />
                  <p className="text-lg text-left w-full lg:text-xs lowercase first-letter:uppercase">
                    <span className="font-semibold"> Bem vindo, </span>
                    <span className="lowercase first-letter:uppercase">
                      {user?.username}
                    </span>
                  </p>
                </div>
                <div className="lg:hidden order-1 flex flex-col border-2 border-blue-950/50 w-[92%]" />
                <div className="hidden lg:block lg:order-2 border-l-2 border-blue-950/50 w-1 h-7" />

                <div className="order-3 lg:order-3 w-full flex flex-col lg:w-1/2 lg:items-end py-4 lg:pr-2 lg:px-0 px-4">
                  <button
                    className="w-full sx:mr-0 sx:w-1/6 m-0 p-0 text-md text-red-600 font-semibold hover:underline underline-offset-2 hover:text-red-400 justify-center items-center flex flex-row gap-2 lg:border-none border-2 border-blue-950/50 py-2"
                    onClick={handlerLogout}
                  >
                    <span>
                      <LogOutIcon className="size-8" />
                    </span>
                    Sair
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
