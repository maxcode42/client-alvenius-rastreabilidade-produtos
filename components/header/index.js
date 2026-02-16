import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  XIcon,
  MenuIcon,
  HomeIcon,
  UserRound,
  LogOutIcon,
  SprayCanIcon,
  PaintRollerIcon,
  ChevronRightIcon,
  PackagePlusIcon,
} from "lucide-react";

import { useAuth } from "../../src/auth/auth-context";
import AlertInfo from "../ui/alert/info";

import logo from "../../assets/imagens/logo.png";

export default function Header() {
  const currentRoute = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [message] = useState("Funcionalidade e recursos em desenvolvimento");

  async function handlerLogout(e) {
    e.preventDefault();
    signOut();
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <header className="flex-col w-full h-36 shadow-blue-600/50 shadow-md md:overflow-hidden inset-0 z-10 relative md:fixed">
        <div className="w-full h-full px-16 sm:px-24 flex flex-row justify-between items-center bg-zinc-300 md:overflow-hidden">
          <div className="flex flex-col w-1/2 h-full justify-center">
            <div className="w-[210px] h-8">
              <Image src={logo} alt="Logo alvenius" priority />
            </div>
            <div className="w-32 h-8">
              <p className="text-sm text-stone-400">
                <small>{process.env.NEXT_PUBLIC_APP_VERSION}</small>
              </p>
            </div>
          </div>
          {user && (
            <div className="flex flex-row w-fit right-0 items-end justify-end md:justify-center md:items-center">
              <div className="flex flex-col bg-red items-center justify-end p-4 -mr-16">
                <button
                  className={`p-4 text-4xl flex flex-col text-right w-full md:hidden ${open ? "hidden transition-all duration-200" : ""}`}
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  <MenuIcon className="text-blue-950/50" size={32} />
                </button>
                <button
                  className={`p-4 text-4xl flex flex-col text-right w-full  sm:hidden ${!open ? "hidden  transition-all duration-200" : ""}`}
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <XIcon className="text-red-400/50" size={32} />
                </button>
              </div>
              <div
                className={`mt-40 md:mt-0 fixed md:relative inset-0 z-40 bg-zinc-300/95 text-zinc-900 transform transition-all 
              duration-300 ease-in-out h-[100vh] md:h-full w-full sm:static sm:translate-x-0 sm:opacity-100 sm:bg-transparent 
              md:pointer-events-auto ${
                open
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none"
              }
            `}
              >
                <nav
                  className={`flex flex-col md:flex-row w-full gap-4 py-8 md:justify-center justify-end items-center`}
                >
                  <div className="order-2 md:order-1 w-full md:w-fit flex flex-col md:flex-row h-full items-center justify-center px-4">
                    {currentRoute !== "/" && (
                      <div className="w-full md:w-fit flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                        <div
                          className={`w-full md:w-fit flex flex-col md:flex-row justify-center items-center`}
                        >
                          <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="w-full flex flex-row items-center justify-between px-4 md:px-0 pt-3 md:pt-5 pb-4 min-w-[9vh] text-center text-lg md:text-md md:inline-block md:border-b-4 md:md:border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                          >
                            <span className="flex flex-row justify-center gap-2 items-center">
                              <span className="md:hidden text-sm">
                                <HomeIcon className="w-auto" size={24} />
                              </span>
                              <span className="uppercase">Início</span>
                            </span>
                            <span className="md:hidden">
                              <ChevronRightIcon className="size-6 text-blue-950/50" />
                            </span>
                          </Link>
                          {/* <div className="hidden md:block border-l-2 border-blue-950/50 w-1 h-4" /> */}
                          <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                        </div>
                        <div
                          className={`${currentRoute === "/register" && "hidden"}  w-full md:w-fit flex flex-col md:flex-row justify-center items-center`}
                        >
                          {/* <div className="hidden md:block border-l-2 border-blue-950/50 w-full h-4 px-4" /> */}
                          <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                          <Link
                            href="/register"
                            onClick={() => setOpen(false)}
                            className="w-full flex flex-row items-center justify-between px-4 md:px-0  pt-3 md:pt-5 pb-4  min-w-[9vh] text-center text-lg md:text-md md:inline-block md:border-b-4 md:md:border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                          >
                            <span className="flex flex-row gap-2 items-center">
                              <span className="md:hidden">
                                <PackagePlusIcon className="w-auto" size={24} />
                              </span>
                              <span className="uppercase">Cadastro</span>
                            </span>
                            <span className="md:hidden">
                              <ChevronRightIcon className="size-6 text-blue-950/50" />
                            </span>
                          </Link>
                        </div>
                        <div
                          className={`${currentRoute === "/boiler-shop" && "hidden"}  w-full md:w-fit flex flex-col md:flex-row justify-center items-center`}
                        >
                          {/* <div className="hidden md:block border-l-2 border-blue-950/50 w-full h-4 px-4" /> */}
                          <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                          <Link
                            href=""
                            // href="/boiler-shop"
                            onClick={() => (setOpen(false), setOpenAlert(true))}
                            className="w-full flex flex-row items-center justify-between px-4 md:px-0  pt-3 md:pt-5 pb-4  min-w-[9vh] text-center text-lg md:text-md md:inline-block border-b-4 border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                          >
                            <span className="flex flex-row gap-2 items-center">
                              <span className="md:hidden">
                                <PackagePlusIcon className="w-auto" size={24} />
                              </span>
                              <span className="uppercase">Caldeiraria</span>
                            </span>
                            <span className="md:hidden">
                              <ChevronRightIcon className="size-6 text-blue-950/50" />
                            </span>
                          </Link>
                        </div>

                        <div
                          className={`${currentRoute === "/coating" && "hidden"}  w-full md:w-fit flex flex-col md:flex-row justify-center items-center`}
                        >
                          {/* <div className="hidden md:block border-l-2 border-blue-950/50 w-full h-4 px-4" /> */}
                          <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                          <Link
                            href=""
                            // href="/coating"
                            onClick={() => (setOpen(false), setOpenAlert(true))}
                            className="w-full flex flex-row items-center justify-between px-4 md:px-0  pt-3 md:pt-5 pb-4  min-w-[9vh] text-center text-lg md:text-md md:inline-block border-b-4 border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                          >
                            <span className="flex flex-row gap-2 items-center">
                              <span className="md:hidden">
                                <SprayCanIcon className="w-auto" size={24} />
                              </span>
                              <span className="uppercase">Revestimento</span>
                            </span>
                            <span className="md:hidden">
                              <ChevronRightIcon className="size-6 text-blue-950/50" />
                            </span>
                          </Link>
                        </div>
                        <div
                          className={`${currentRoute === "/painting" && "hidden"}  w-full md:w-fit flex flex-col md:flex-row justify-center items-center`}
                        >
                          {/* <div className="hidden md:block border-l-2 border-blue-950/50 w-full h-4 px-4" /> */}
                          <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" />
                          <Link
                            href=""
                            // href="/painting"
                            onClick={() => (setOpen(false), setOpenAlert(true))}
                            className="w-full flex flex-row items-center justify-between px-4 md:px-0  pt-3 md:pt-5 pb-4  min-w-[9vh] text-center text-lg md:text-md md:inline-block border-b-4 border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 cursor-pointer"
                          >
                            <span className="flex flex-row gap-2 items-center">
                              <span className="md:hidden">
                                <PaintRollerIcon className="w-auto" size={24} />
                              </span>
                              <span className="uppercase">Pintura</span>
                            </span>
                            <span className="md:hidden">
                              <ChevronRightIcon className="size-6 text-blue-950/50" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="order-1 md:order-2 w-full inline-flex justify-center items-center px-4 py-4 md:px-2 gap-4">
                    <div className="hidden md:block border-l-2 border-blue-950/50 w-1 h-7" />
                    {/* <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full" /> */}
                    <UserRound className="w-auto" size={32} />{" "}
                    <p className="text-lg text-left w-full md:text-xs md:w-fit lowercase first-letter:uppercase">
                      <span className="font-semibold"> Bem vindo, </span>
                      <span className="lowercase first-letter:uppercase">
                        {user.username}
                      </span>
                    </p>
                  </div>
                  <div className="md:hidden order-1 flex flex-col border-2 border-blue-950/50 w-[90%]" />
                  <div className="hidden md:block md:order-2 border-l-2 border-blue-950/50 w-1 h-7" />

                  <div className="order-3 md:order-3 w-full flex flex-col md:w-1/2 md:items-end py-4 md:px-0 px-4">
                    <button
                      className="w-full sx:mr-0 sx:w-1/6 m-0 p-0 text-md text-red-600 font-semibold hover:underline underline-offset-2 hover:text-red-400 justify-center items-center flex flex-row gap-2 md:border-none border-2 border-blue-950/50 py-2"
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
      {/* Alert */}
      {openAlert && (
        <AlertInfo
          message={message}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setScannerLocked={() => {}}
        />
      )}
    </>
  );
}
