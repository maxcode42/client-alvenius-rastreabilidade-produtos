import { useRouter } from "next/router";
import { SaveIcon, QrCodeIcon, ArrowBigRightDashIcon } from "lucide-react";

import withAuth from "../../src/auth/auth-with";

import Header from "../../components/header";
import Body from "../../components/body";
import Button from "components/ui/button";
import Table from "components/ui/table";

function BoilerShop() {
  const router = useRouter();
  const items = [
    {
      codigo: "TJPLPL50K000311",
      quantidade: 2.0,
      fluxo: "tubo teste",
      fornecedor: "005436",
      descricao:
        "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
    },
    {
      codigo: "TJPLPL50K000311",
      quantidade: 2.0,
      fluxo: "tubo teste",
      fornecedor: "005436",
      descricao:
        "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
    },
    {
      codigo: "TJPLPL50K000311",
      quantidade: 2.0,
      fluxo: "tubo teste",
      fornecedor: "005436",
      descricao:
        "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
    },
    {
      codigo: "TJPLPL50K000311",
      quantidade: 2.0,
      fluxo: "tubo teste",
      fornecedor: "005436",
      descricao:
        "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
    },
    {
      codigo: "TJPLPL50K000311",
      quantidade: 2.0,
      fluxo: "tubo teste",
      fornecedor: "005436",
      descricao:
        "Tubo ASTMA134 PL 508MM x 6,30MM ASTM A 283 GRC DIMESOES CONF ASME B 36.10",
    },
  ];

  function handleNext(e) {
    e.preventDefault();
    router.replace("/coating");
  }

  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <div className="flex flex-col w-full px-4 py-16 justify-center items-center">
          <section className="overflow-hidden sm:w-1/2 min-h-96 px-4 py-4 w-full flex flex-col gap-2 justify-center items-center border-blue-950/50 border-2 rounded-sm">
            <div className="w-full">
              <h3 className="text-2xl text-center font-semibold py-4">
                Caldeiraria
              </h3>
            </div>
            <div className="w-full h-1/2 flex flex-col sm:flex-col gap-4">
              <div className="w-full min-w-full h-96 border-blue-950/50 border-2 rounded-sm overflow-x-auto">
                <Table items={items} />
              </div>
              <div className="w-full  sm:w-full h-24 flex gap-4 flex-row">
                <Button>
                  <span className="text-xs sm:text-sm md:text-base">
                    <QrCodeIcon className="size-8" />
                  </span>
                  Escanear
                </Button>

                <Button onClick={handleNext}>
                  <span className="text-xs sm:text-sm md:text-base">
                    <ArrowBigRightDashIcon className="size-8" />
                  </span>
                  Proxima etapa
                </Button>

                <Button>
                  <span className="text-xs sm:text-sm md:text-base">
                    <SaveIcon className="size-8" />
                  </span>
                  Salvar
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Body>
    </div>
  );
}

export default withAuth(BoilerShop);
