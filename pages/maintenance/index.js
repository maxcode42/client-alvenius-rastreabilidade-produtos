import Image from "next/image";

import LayoutPage from "components/layout-page";

import developer from "../../assets/imagens/em_desenvolvimento.jpg";

export default function Maintenance() {
  return (
    <LayoutPage>
      <div className="sm:w-1/3 h-1/2 rounded-lg bg-stone-100 mt-12">
        <Image src={developer} alt="Imagem em desenvolvimento" />
      </div>
      <div className="flex-row sm:w-1/3 h-full">
        <h3 className="text-center font-medium text-md sm:text-2xl py-8 animate-pulse">
          Em desenvolvimento
        </h3>
        <hr className="bg-stone-900 opacity-5 h-1 mb-4 m-4 sm:m-0 sm:px-0" />
        <p className="text-stone-600 text-justify px-8 sm:px-0 sm:py-4">
          A plataforma encontra-se em desenvolvimento, com novos recursos em
          fase de implementação para otimização do fluxo de produtos.
        </p>
      </div>
    </LayoutPage>
  );
}
