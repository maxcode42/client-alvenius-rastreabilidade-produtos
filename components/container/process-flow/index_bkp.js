import { useCallback, useEffect, useState } from "react";

import Header from "../../header";
import Body from "../../body";
import CardItems from "../../ui/card-items";
import PanelDefault from "../../ui/panel-default";
import PanelPrimary from "../../ui/panel-primary";
import HeaderPageTitle from "../../header-page-title";
import HeaderPageButtons from "../../header-page-buttons";

import CardItemsCustom from "../../ui/card-items-custom";
import QRCodeFlowCustom from "../../ui/modal/qr-code-flow-custom";
import QRCodeFlow from "../../ui/modal/qr-code-flow";
import AlertInfo from "../../ui/alert/info";

import api from "infra/provider/api-web";
import { useQRCode } from "hooks/qr-code-context";
import QRCodeQuestion from "components/ui/modal/qr-code-querstion";

export default function ProcessFlow({
  textModal = "",
  title = "",
  info = "",
  route,
}) {
  console.count(">>CONTAINER QR-CODE");

  const {
    setSpool,
    currentSpool,
    setOnClose,
    setOpenQRCode,
    setCurrentSpool,
    openAlert,
    setOpenAlert,
    setAction,
    openQRCode,
    setScannerLocked,
    message,
    newStatus,
    setNewStatus,
    setResult,
  } = useQRCode();

  const cardCustom = false;

  const [text, setText] = useState("");
  const [itens, setItens] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [itensFiltered, setItensFiltered] = useState([]);
  const [isOpenQuestion, setIsOpenQuestion] = useState(true);
  const [getData, setGetData] = useState({});

  /* =========================
     FETCH (RODA 1 VEZ POR ROUTE)
     ========================= */
  const fetchData = useCallback(async () => {
    console.count(">>fetchData");
    const results = await api.execute[route].read();
    setItens(results || []);
  }, [route]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     HANDLER DATA
     ========================= */
  function normalizeAlphanumeric(text) {
    return text?.replace(/[^A-Za-z0-9]/g, "")?.trim();
  }

  async function handlerData() {
    console.count(">>handlerData");

    if (!getData || !currentSpool) return;

    const objectData = {
      codigo: normalizeAlphanumeric(currentSpool?.codigo),
      status: newStatus,
      processo: "CA",
      conformidade: getData?.accordance ? "S" : "N",
      reversivel: getData?.reversible ? "S" : "N",
      disposicao_qualidade: getData?.qualityText || "",
    };

    console.log(objectData);

    // await api.execute[route].create({ data: objectData });

    setNewStatus(null);
  }

  /* =========================
     SEARCH
     ========================= */
  function formatToPtBR(dateStr) {
    if (!dateStr) return;

    const year = Number(dateStr.slice(0, 4));
    const month = Number(dateStr.slice(4, 6)) - 1;
    const day = Number(dateStr.slice(6, 8));

    return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month, day));
  }

  function formatCodeDefault(code) {
    return code.replace(/^([A-Z]{2})(\d{4})(\d{5})(\d{3})$/, "$1-$2-$3-$4");
  }

  useEffect(() => {
    if (!itens.length) {
      setItensFiltered([]);
      return;
    }

    const time = setTimeout(() => {
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
    }, 500);

    return () => clearTimeout(time);
  }, [searchText, itens]);

  /* =========================
     MODAL QR
     ========================= */
  async function openModalQRCode(e) {
    e.preventDefault();

    setScannerLocked(false);
    setResult(null);
    setText(textModal);
    setOpenAlert(false);
    setOpenQRCode(true);
  }

  /* =========================
     DEFAULT ACTIONS (1 VEZ)
     ========================= */
  useEffect(() => {
    setOnClose(() => () => {
      setOpenQRCode(false);
      setSpool(null);
      setScannerLocked(true);
    });

    setAction(() => () => handlerData());
  }, [setOnClose, setOpenQRCode, setSpool, setScannerLocked, setAction]);

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <PanelDefault>
          <HeaderPageTitle title={title} text={info} />

          <HeaderPageButtons
            searchText={searchText}
            setSearchText={setSearchText}
            setCurrentSpool={setCurrentSpool}
            openModalQRCode={openModalQRCode}
          />

          <PanelPrimary cssCustom="border-none">
            {cardCustom ? (
              <CardItemsCustom setText={setText} items={itensFiltered} />
            ) : (
              <CardItems setText={setText} items={itensFiltered} />
            )}
          </PanelPrimary>
        </PanelDefault>
      </Body>

      {openQRCode && cardCustom && <QRCodeFlowCustom />}

      {openQRCode && !cardCustom && <QRCodeFlow text={text} />}

      {openAlert && cardCustom && (
        <AlertInfo
          action={null}
          message={message}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setScannerLocked={setScannerLocked}
        />
      )}

      {isOpenQuestion && (
        <QRCodeQuestion
          setIsOpenQuestion={setIsOpenQuestion}
          handlerData={handlerData}
          setData={setGetData}
        />
      )}
    </div>
  );
}
