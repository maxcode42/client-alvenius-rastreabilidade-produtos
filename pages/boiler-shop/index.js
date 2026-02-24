import { useCallback, useEffect, useMemo, useState } from "react";
import { QrCodeIcon, InfoIcon, SearchIcon } from "lucide-react";

import withAuth from "../../src/auth/auth-with";

import Header from "../../components/header";
import Body from "../../components/body";
import Button from "components/ui/button";
import TableFlow from "components/ui/table-flow";
import ListFlow from "components/ui/list-flow";
import QRCodeFlow from "components/ui/modal/qr-code-flow";

import api from "provider/api-web";

function BoilerShop() {
  //const [openAlertInfo, setOpenAlertInfo] = useState(false);
  //const [loading, setLoading] = useState(false);
  const [openQRCode, setOpenQRCode] = useState(false);
  const [spool, setSpool] = useState(null);
  const [itens, setItens] = useState([]);
  const [itensFiltered, setItensFiltered] = useState([]);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const isView = "list"; //"list"; //table

  const titles = useMemo(() => {
    return [
      "Item",
      "Info",
      "Código",
      "Status",
      "Iniciar",
      "Finalizar",
      "Qualidade",
    ]; //, "Descrição"];
  }, []);

  // const spool = {
  //   codigo: "fadfasdfasdf",
  //   descricao: "dafasdfasdfasdfas",
  // };

  async function handleFindOnByCode(code) {
    const results = await api.findOnByCodeBoilerShop({ code });

    return results;
  }

  function openModalQRCode(e) {
    e.preventDefault();
    setText("para buscar o SPOOL e seguir fluxo do");
    setOpenQRCode(true);
  }

  async function handleGetAllDataBoilerShop() {
    const results = await api.getBoilerShop();

    setItens(results);
  }

  function formatToPtBR(dateStr) {
    if (!dateStr) return;

    const year = Number(dateStr.slice(0, 4));
    const month = Number(dateStr.slice(4, 6)) - 1;
    const day = Number(dateStr.slice(6, 8));

    const date = new Date(year, month, day); // cria em horário local

    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  function formatCodeDefault(code) {
    const result = code.replace(
      /^([A-Z]{2})(\d{4})(\d{5})(\d{3})$/,
      "$1-$2-$3-$4",
    );
    return result;
  }

  const handleSearch = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      const filtered = itens.filter((item) => {
        const status = item.status;
        const code = item.codigo;
        const codeFormat = formatCodeDefault(item.codigo);
        const dateStart = formatToPtBR(item.dateStart);
        const dateEnd = formatToPtBR(item.dateEnd);

        return (
          code.includes(searchText.toUpperCase()) ||
          codeFormat.includes(searchText.toUpperCase()) ||
          status.includes(searchText.toLowerCase()) ||
          dateStart?.includes(searchText) ||
          dateEnd?.includes(searchText)
        );
      });
      setItensFiltered(filtered);
    },
    [itens, searchText],
  );

  useEffect(() => {
    handleGetAllDataBoilerShop();
  }, []);

  useEffect(() => {
    const time = setTimeout(() => {
      handleSearch(null);
    }, 1_000);

    return () => clearTimeout(time);
  }, [searchText, handleSearch]);

  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <div className="flex flex-col w-full px-4 py-6 md:mt-16 justify-start items-center h-full overflow-hidden">
          <section className="overflow-y-scroll md:overflow-hidden h-full sm:h-full sm:w-1/2 sm:min-h-[70vh] px-4 py-4 w-full flex flex-col gap-2 justify-start items-start border-blue-950/50 border-2 rounded-sm">
            <div className="w-full bg-stone-300/50">
              <h3 className="text-2xl text-center font-semibold py-2 ">
                Caldeiraria
              </h3>
              <div className="flex flex-row items-center gap-2 py-1 px-1">
                <InfoIcon size={16} className="text-blue-950/50" />
                <p className="text-xs">
                  Leitura Spool, iniciar, finalizar e executar processo
                  produção.
                </p>
              </div>
            </div>
            {/* <div class="search-container">
              <img src="assets/search.svg" alt="Buscar" class="search-icon" />
              <input
                type="text"
                class="search-input"
                id="search-input"
                placeholder="Buscar por título"
              />
              <button class="btn btn-primary btn-full" id="btn-new">
                Novo prompt
              </button>
            </div> */}

            <div className="w-full sm:w-full h-16 flex gap-4 flex-row justify-end items-center">
              <div class="border-stone-2 gap-2 w-full sm:w-full h-full py-1 flex flex-col items-center mt-2">
                <SearchIcon
                  className={`size-6 text-stone-300 translate-y-4 absolute left-12 `}
                />
                <input
                  type="text"
                  id="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-xs w-full bg-transparent h-16 border-stone-300/50 rounded-md border-2 pl-10 pr-2"
                  placeholder="Buscar por código, status, data"
                />
              </div>

              <div className="w-1/2 sm:w-full h-16 flex gap-4 flex-row">
                <Button
                  type="button"
                  onClick={(e) => openModalQRCode(e)}
                  title="Escanear QRCode para inicio ou finalizar processo."
                >
                  <QrCodeIcon className="size-6 sm:size-8" />
                  <span className="text-sm sm:text-base truncate">
                    Escanear
                  </span>
                </Button>

                {/* <Button
                  onClick={(e) => handleConfirmClear(e)}
                  disabled={itens.length === 0 && spool === null}
                >
                  <Trash2Icon className="size-6 sm:size-8" />
                  <span className="text-sm sm:text-base truncate"> Limpar</span>
                </Button> */}

                {/* <Button
                  disabled={itens.length === 0 || openAlertInfo || loading}
                  onClick={(e) => handleCreateRegister(e)}
                >
                  {openAlertInfo || loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="fel flex row gap-2 justify-center items-center">
                      <SaveIcon className="size-6 sm:size-8" />
                      <span className="text-sm sm:text-base truncate">
                        Gravar
                      </span>
                    </span>
                  )}
                </Button> */}
              </div>
            </div>
            <div className="w-full h-full sm:h-1/2 flex flex-col sm:flex-col gap-4 pb-8">
              <div className="w-full min-w-full h-70 min-h-64 sm:min-h-96 sm:h-96 sm:max-h-96 border-blue-950/50 border-2 rounded-sm overflow-auto">
                {isView === "table" ? (
                  <TableFlow titles={titles} items={itens} />
                ) : (
                  <ListFlow
                    items={itensFiltered}
                    setText={setText}
                    setOpenQRCode={setOpenQRCode}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </Body>
      {openQRCode && (
        <QRCodeFlow
          text={text}
          itens={itens}
          spool={spool}
          setSpool={setSpool}
          isOpen={openQRCode}
          action={handleFindOnByCode}
          onClose={() => {
            setOpenQRCode(false), setSpool(null);
          }}
        />
      )}
    </div>
  );
}

export default withAuth(BoilerShop);
