import Header from "../components/header";
import Body from "../components/body";

import withAuth from "../src/auth/auth-with";
import ButtonPanel from "components/ui/button-panel";

function Home() {
  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <h2 className="font-semibold text-4x sm:text-2xl py-4 px-8 rounded-lg mt-[-38px] bg-stone-50">
          Rastreabilidade de produtos
        </h2>
        <div className="flex flex-col w-full px-4 py-4 justify-center items-center">
          <section className="overflow-hidden sm:w-1/2 min-h-96 px-4 py-4 w-full flex flex-col gap-2 justify-center items-center border-blue-950/50 border-2 rounded-sm">
            <div className="w-full">
              <h3 className="text-2xl text-center font-semibold py-4">
                Clique no que deseja fazer
              </h3>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel text="Escanear componentes / proxima etapa">
                  Spool
                </ButtonPanel>
              </div>
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel text="Escanear componentes reservado / proxima etapa">
                  Caldeiraria
                </ButtonPanel>
              </div>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel text="Escanear componentes para revestimento / proxima etapa">
                  Revestimento
                </ButtonPanel>
              </div>
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel text="Escanear componentes para pintura / encerrar etapas">
                  Pintura
                </ButtonPanel>
              </div>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="w-full sm:w-1/2 h-32">
                <ButtonPanel text="Empresa, Produtos, Orçamento, Catálogos, Contato, etc.">
                  <span>IR PARA SITE ALVENIUS</span>
                </ButtonPanel>
              </div>
            </div>
          </section>
        </div>
      </Body>
    </div>
  );
}

export default withAuth(Home);
