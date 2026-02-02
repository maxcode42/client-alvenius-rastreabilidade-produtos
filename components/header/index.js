import Image from "next/image";

import { useAuth } from "../../src/auth/auth-context";

import logo from "../../assets/imagens/logo.png";

export default function Header() {
  const { user, signOut } = useAuth();

  async function handlerLogout(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <header className="flex-col w-full h-40 ">
      <div className="w-full h-full px-16 sm:px-24 flex flex-row items-center bg-zinc-300">
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
          <div className="flex flex-col items-end w-1/2">
            <button
              className="w-1/3 -mr-12 sx:mr-0 sx:w-1/6 border-l-2 border-blue-950/50 m-0 p-0 text-md text-red-600 font-semibold hover:underline underline-offset-2 hover:text-red-400 justify-center items-center flex flex-col"
              onClick={handlerLogout}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
