import { useCallback, useEffect, useState } from "react";

import Header from "../../components/header";
import Body from "../../components/body";
import CardItems from "components/ui/card-items";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import HeaderPageButtons from "components/header-page-buttons";

import CardItemsCustom from "components/ui/card-items-custom";
import QRCodeFlowCustom from "components/ui/modal/qr-code-flow-custom";
import QRCodeFlow from "components/ui/modal/qr-code-flow";
import AlertInfo from "components/ui/alert/info";

import withAuth from "../../auth/auth-with";
import api from "infra/provider/api-web";

function BoilermakingBkp() {
  const [text, setText] = useState("");
  const [itens, setItens] = useState([]);
  const [spool, setSpool] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [openQRCode, setOpenQRCode] = useState(false);
  const [itensFiltered, setItensFiltered] = useState([]);
  const [currentSpool, setCurrentSpool] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const cardCustom = false;

  const testeAPI = async (code) => {
    return code;
  };

  async function handleFindOnByCode(code) {
    const results = await testeAPI(code); //api.findOnByCodeboilermaking({ code });

    return results;
  }

  function openModalQRCode(e) {
    e.preventDefault();
    setText("para buscar o SPOOL e seguir fluxo do");
    setOpenQRCode(true);
  }

  async function handleGetAllDataboilermaking() {
    const results = await api.getboilermaking();

    setItens(results);
  }

  async function handlerboilermaking(data, item) {
    console.log(">>INDEX boilermaking");
    console.log({
      data,
      item,
      newStatus,
    });
    const handlerData = {
      codigo: item?.codigo,
      status: newStatus,
      processo: "CA",
      conformidade: data?.accordance ? "S" : "N",
      reversivel: data?.reversible ? "S" : "N",
      disposicao_qualidade: data?.qualityText || "",
    };
    await api.sendboilermaking({ data: handlerData });

    //setItens([]);
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
    handleGetAllDataboilermaking();
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
            setCurrentSpool={setCurrentSpool}
            openModalQRCode={openModalQRCode}
          />

          <PanelPrimary
            // cssCustom={`${itensFiltered.length === 0 || cardCustom ? "border-none" : ""}`}
            cssCustom={`border-none`}
          >
            {cardCustom ? (
              <CardItemsCustom
                setText={setText}
                items={itensFiltered}
                setMessage={setMessage}
                setOpenAlert={setOpenAlert}
                setOpenQRCode={setOpenQRCode}
                setCurrentSpool={setCurrentSpool}
              />
            ) : (
              <CardItems
                setText={setText}
                items={itensFiltered}
                setOpenQRCode={setOpenQRCode}
                setCurrentSpool={setCurrentSpool}
                setNewStatus={setNewStatus}
              />
            )}
          </PanelPrimary>
        </PanelDefault>
      </Body>
      {openQRCode && cardCustom && (
        <QRCodeFlowCustom
          itens={itens}
          spool={spool}
          setSpool={setSpool}
          isOpen={openQRCode}
          currentSpool={currentSpool}
          action={handleFindOnByCode}
          onClose={() => {
            setOpenQRCode(false), setSpool(null);
          }}
        />
      )}

      {openQRCode && !cardCustom && (
        <QRCodeFlow
          text={text}
          itens={itens}
          spool={spool}
          setSpool={setSpool}
          isOpen={openQRCode}
          currentSpool={currentSpool}
          action={(handleFindOnByCode, handlerboilermaking)}
          onClose={() => {
            setOpenQRCode(false), setSpool(null);
          }}
        />
      )}

      {openAlert && (
        <AlertInfo
          action={null}
          message={message}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setScannerLocked={() => {}}
        />
      )}
    </div>
  );
}

export default withAuth(BoilermakingBkp);
