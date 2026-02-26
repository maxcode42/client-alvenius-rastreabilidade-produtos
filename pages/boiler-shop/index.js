import { useCallback, useEffect, useState } from "react";

import Header from "../../components/header";
import Body from "../../components/body";
import CardItems from "components/ui/card-items";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import HeaderPageButtons from "components/header-page-buttons";

import QRCodeFlow from "components/ui/modal/qr-code-flow";

import withAuth from "../../auth/auth-with";
import api from "infra/provider/api-web";

function BoilerShop() {
  const [openQRCode, setOpenQRCode] = useState(false);
  const [spool, setSpool] = useState(null);
  const [itens, setItens] = useState([]);
  const [itensFiltered, setItensFiltered] = useState([]);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentSpool, setCurrentSpool] = useState({});

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

      const filtered = itens?.filter((item) => {
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
        <PanelDefault>
          <HeaderPageTitle
            title="Caldeiraria"
            text="Leitura Spool, iniciar, finalizar e executar processo produção."
          />

          <HeaderPageButtons
            searchText={searchText}
            setSearchText={setSearchText}
            openModalQRCode={openModalQRCode}
          />

          <PanelPrimary>
            <CardItems
              items={itensFiltered}
              setText={setText}
              setOpenQRCode={setOpenQRCode}
              setCurrentSpool={setCurrentSpool}
            />
          </PanelPrimary>
        </PanelDefault>
      </Body>
      {openQRCode && (
        <QRCodeFlow
          text={text}
          itens={itens}
          spool={spool}
          setSpool={setSpool}
          currentSpool={currentSpool}
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
