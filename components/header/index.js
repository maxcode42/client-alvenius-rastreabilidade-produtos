import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogOutIcon, UserRound } from "lucide-react";

import { useAuth } from "../../src/auth/auth-context";

import logo from "../../assets/imagens/logo.png";

export default function Header() {
  const currentRoute = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  async function handlerLogout(e) {
    e.preventDefault();
    signOut();
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <header className="flex-col w-full h-36 shadow-blue-600/50 shadow-md md:overflow-hidden inset-0 z-10 relative md:fixed">
      <div className="w-full h-full px-16 sm:px-24 flex flex-row justify-between items-center bg-zinc-300 md:overflow-hidden">
        <div className="flex flex-col w-1/2 h-full justify-center">
          <div className="w-[210px] h-8">
            <Image src={logo} alt="Logo alvenius" priority />
          </div>
          <div className="w-32 h-8">
            <p className="">
              <small>v0.0.1</small>
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
                ☰
              </button>
              <button
                className={`p-4 text-4xl flex flex-col text-right w-full  sm:hidden ${!open ? "hidden  transition-all duration-200" : ""}`}
                onClick={() => setOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div
              className={`mt-40 md:mt-0 fixed md:relative inset-0 z-40 bg-zinc-300/90 text-zinc-900 transform transition-all 
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
                    <>
                      <Link
                        href="/"
                        className="mr-6 min-w-[9vh] text-center text-lg md:text-md inline-block border-b-4 border-transparent transition-all duration-300 hover:scale-120 hover:font-extrabold hover:border-zinc-500 hover:text-zinc-500 pt-5 pb-4 cursor-pointer"
                      >
                        DASHBOARD
                      </Link>
                      <div className="hidden md:block border-l-2 border-blue-950/50 w-1 h-7" />
                      <div className="md:hidden order-2 flex flex-col border-2 border-blue-950/50 w-full mt-4" />
                    </>
                  )}
                </div>
                <div className="order-1 md:order-2 w-full inline-flex justify-center items-center px-4 py-4 md:px-2 gap-4">
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

                <div className="order-3 md:order-3 w-full flex flex-col md:w-1/2 md:items-end py-4">
                  <button
                    className="w-full sx:mr-0 sx:w-1/6 m-0 p-0 text-md text-red-600 font-semibold hover:underline underline-offset-2 hover:text-red-400 justify-center items-center flex flex-row gap-2"
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
