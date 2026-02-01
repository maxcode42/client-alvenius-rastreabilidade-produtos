import Image from "next/image";

import logo from "../../assets/imagens/logo.png";

export default function Header() {
  return (
    <header className="flex-col w-full h-40 ">
      <div className="w-full h-full  px-16 sm:px-24 flex flex-col justify-center bg-zinc-300">
        <div className="w-[210px] h-8">
          <Image src={logo} alt="Logo alvenius" />
        </div>
        <div className="w-32 h-8">
          <p className="">
            <small>v0.0.1</small>
          </p>
        </div>
      </div>
    </header>
  );
}
