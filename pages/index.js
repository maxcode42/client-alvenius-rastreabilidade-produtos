import { useState } from "react";
import {
  PackagePlusIcon,
  PaintBucketIcon,
  SprayCanIcon,
  PaintRollerIcon,
  GlobeIcon,
} from "lucide-react";

import Header from "../components/header";
import Body from "../components/body";

import withAuth from "../src/auth/auth-with";
import ButtonPanel from "components/ui/button-panel";
import AlertInfo from "components/ui/alert/info";

function Home() {
  const [openAlert, setOpenAlert] = useState(false);
  const [message] = useState("Funcionalidade e recursos em desenvolvimento");

  return (
    <div className="w-full h-full bg-stone-100">
      <Header />

      <Body>
        <div className="flex flex-col w-full px-4 py-6 md:mt-16 justify-center items-center h-full">
          <section className="overflow-y-scroll sm:overflow-hidden h-full sm:h-full sm:w-1/2 sm:min-h-96 px-4 py-4 w-full flex flex-col gap-6 sm:gap:4 sm:justify-center items-start border-blue-950/50 border-2 rounded-sm">
            <div className="w-full">
              <h3 className="text-2xl text-center font-semibold py-4">
                Clique no que deseja fazer
              </h3>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 h-32 ">
                <ButtonPanel
                  href={"/register"}
                  key={"register"}
                  text="Cadastro Spool e componentes / proxima etapa"
                >
                  <span className="text-sm">
                    <PackagePlusIcon className="size-8" />
                  </span>
                  Cadastro
                </ButtonPanel>
              </div>
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel
                  // href=""
                  // onClick={() => setOpenAlert(true)}
                  href={"/boiler-shop"}
                  key={"boiler-shop"}
                  text="Escanear componentes reservado / proxima etapa"
                >
                  <span className="text-sm">
                    <PaintBucketIcon className="size-8" />
                  </span>
                  Caldeiraria
                </ButtonPanel>
              </div>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel
                  href=""
                  onClick={() => setOpenAlert(true)}
                  // href={"/coating"}
                  key={"coating"}
                  text="Escanear componentes para revestimento / proxima etapa"
                >
                  <span className="text-sm">
                    <SprayCanIcon className="size-8" />
                  </span>
                  Revestimento
                </ButtonPanel>
              </div>
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel
                  href=""
                  onClick={() => setOpenAlert(true)}
                  // href={"/painting"}
                  key={"painting"}
                  text="Escanear componentes para pintura / encerrar etapas"
                >
                  <span className="text-sm">
                    <PaintRollerIcon className="size-8" />
                  </span>
                  Pintura
                </ButtonPanel>
              </div>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel
                  key={"site"}
                  target="_blank"
                  href={"https://alvenius.ind.br/"}
                  text="Empresa, Produtos, Orçamento, Catálogos, Contato, etc."
                >
                  <span className="text-sm">
                    <GlobeIcon className="size-8" />
                  </span>
                  <span>IR PARA SITE ALVENIUS</span>
                </ButtonPanel>
              </div>
            </div>
          </section>
        </div>
      </Body>
      {/* Alert */}
      {openAlert && (
        <AlertInfo
          message={message}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setScannerLocked={() => {}}
        />
      )}
    </div>
  );
}

export default withAuth(Home);
