import { useCallback, useEffect, useState } from "react";

import Header from "../../header"; //"../../components/header";
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
import QRCodeQuestion from "components/ui/modal/qr-code-question";
import Loading from "components/ui/loading";
import Separator from "components/ui/separator";
import { ArchiveXIcon } from "lucide-react";

export default function ProcessFlow({
  textModal = "",
  title = "",
  info = "",
  route,
}) {
  const [text, setText] = useState("");
  // const [spool, setSpool] = useState(null);
  // const [currentSpool, setCurrentSpool] = useState(null);
  //const [openQRCode, setOpenQRCode] = useState(false);
  //const [openAlert, setOpenAlert] = useState(false);
  // const [getData, setGetData] = useState({});
  //const [message, setMessage] = useState("");
  // const [newStatus, setNewStatus] = useState("");

  const cardCustom = true;

  const {
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

  const [itens, setItens] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [itensFiltered, setItensFiltered] = useState([]);
  const [isOpenQuestion, setIsOpenQuestion] = useState(false);
  const [loading, setLoading] = useState(true);

  // const testeAPI = async (code) => {
  //   return code;
  // };

  // async function findOnByCode(code) {
  //   const results = await testeAPI(code); //await api.execute[route].find({ params: code });
  //   //
  //   //console.log(results);
  //   return results;
  // }
  async function openModalQRCode(e) {
    e.preventDefault();

    //await setCurrentSpool(item);
    await setScannerLocked(false);
    await setResult(null);
    await setOpenQRCode(true);
    // }
    // function openModalQRCode(e) {
    //   e.preventDefault();
    //setText("para buscar o SPOOL e seguir fluxo do");
    setText(textModal);
    setOpenAlert(false);
    //setOpenQRCode(true);
  }

  function normalizeAlphanumeric(text) {
    return text?.replace(/[^A-Za-z0-9]/g, "")?.trim();
  }

  function formatToPtBR(dateStr) {
    if (!dateStr) return;

    const year = Number(dateStr.slice(0, 4));
    const month = Number(dateStr.slice(4, 6)) - 1;
    const day = Number(dateStr.slice(6, 8));

    const date = new Date(year, month, day); // cria em horário local

    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  // function formatCodeDefault(code) {
  //   const result = code.replace(
  //     /^([A-Z]{2})(\d{4})(\d{5})(\d{3})$/,
  //     "$1-$2-$3-$4",
  //   );
  //   return result;
  // }
  function formatCodeDefault(code) {
    // const result = code.replace(
    //   /^([A-Z]{2})(\d{4})(\d{5})(\d{4})$/,
    //   "$1-$2-$3-$4",
    // );
    // const result = code.replace(
    //   /^(?=.{15}$)([A-Z]{2})([A-Za-z0-9]{4})([A-Za-z0-9]{5})([A-Za-z0-9]{4,5})$/,
    //   (_, g1, g2, g3, g4) => `${g1}-${g2}-${g3}-${g4}`,
    // );
    // return result;
    const text = normalizeAlphanumeric(code);
    const match = text.match(/^(?=.{6,15}$)([A-Z]{2})([A-Za-z0-9]+)$/);
    if (!match) return null;

    const prefix = match[1];
    let rest = match[2];

    const groups = [prefix];

    if (rest.length >= 4) {
      groups.push(rest.slice(0, 4));
      rest = rest.slice(4);
    }

    if (rest.length >= 5) {
      groups.push(rest.slice(0, 5));
      rest = rest.slice(5);
    }

    if (rest.length >= 4) {
      const size = rest.length >= 5 ? 5 : 4;
      groups.push(rest.slice(0, size));
      rest = rest.slice(size);
    }

    if (rest.length > 0) {
      groups.push(rest);
    }

    return groups.join("-");
  }

  const fetchData = useCallback(async () => {
    const results = await api.execute[route].read();

    setItens(results);
  }, [route]);

  const handleSearch = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      if ((!itens || !itens?.length || itens?.length === 0) && !currentSpool) {
        setLoading(false);
        return null;
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
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itens, searchText],
  );

  async function handlerData(getData) {
    //if (!getData || !currentSpool) return;
    if (!currentSpool) return;

    const objectData = {
      codigo: await normalizeAlphanumeric(currentSpool?.codigo),
      status: newStatus, //EX
      processo: "CA",
      conformidade: getData?.accordance ? "S" : "N",
      reversivel: getData?.reversible ? "S" : "N",
      disposicao_qualidade: getData?.qualityText || "",
    };

    await api.execute[route].create({
      data: objectData,
    });

    setItensFiltered(null);
    setNewStatus(null);
    setItens(null);
  }

  useEffect(() => {
    if (itens?.length >= 0) return;

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itens]);

  useEffect(() => {
    const time = setTimeout(() => {
      handleSearch(null);
    }, 1_000);

    return () => clearTimeout(time);
  }, [searchText, handleSearch]);

  const assignDefaultStandards = useCallback(() => {
    // setOnClose(() => {
    //   return () => {
    //     setOpenQRCode(false), setSpool(null), setScannerLocked(true);
    //   };
    // });

    // setAction(() => {
    //   return () => {
    //     findOnByCode(), handlerData();
    //   };
    // });
    // setAction(() => {
    //   return () => {
    //     handlerData();
    //   };
    // });
    setCurrentSpool(null);
    setOnClose(() => {
      // return () => {
      //   setOpenQRCode(false), setSpool(null), setScannerLocked(true);
      // };
      return () => {
        setOpenQRCode(false), setScannerLocked(true);
      };
    });
    setAction(() => () => handlerData());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!newStatus) return;

    if (newStatus === "RO") {
      setIsOpenQuestion(true);
      return;
    }

    setLoading(true);
    handlerData();
    setNewStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

  useEffect(() => {
    assignDefaultStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //if (!itens) return null;

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

          <Separator />

          <PanelPrimary className={`border-none`}>
            {/* {!itens || !itens?.length || loading ?? <Loading />} */}
            {(!itens || !itens?.length) && loading && <Loading />}

            {itens?.length === 0 && !loading && (
              <div className="w-full h-full flex flex-col min-h-72 flex-1 px-2 py-8 gap-8 border-blue-300/50 border-2 rounded-md text-center">
                <div className="flex flex-col justify-center items-center">
                  <i className="border-[.1rem] border-blue-400/50 rounded-full p-6 shadow-lg bg-stone-100 shadow-blue-300/50">
                    <ArchiveXIcon className="size-8 text-blue-950/50 " />
                  </i>
                </div>
                <p className="font-semibold text-blue-950/50 px-4">
                  Nenhum registro cadastrado ou encontrado no sistema!
                </p>
              </div>
            )}
            {!loading &&
              (cardCustom ? (
                <CardItemsCustom
                  setText={setText}
                  items={itensFiltered}
                  //setMessage={setMessage}
                  //setOpenAlert={setOpenAlert}
                  // setOpenQRCode={setOpenQRCode}
                  // setCurrentSpool={setCurrentSpool}
                />
              ) : (
                <CardItems
                  setText={setText}
                  items={itensFiltered}
                  //setOpenQRCode={setOpenQRCode}
                  //setCurrentSpool={setCurrentSpool}
                  //setNewStatus={setNewStatus}
                />
              ))}
          </PanelPrimary>
        </PanelDefault>
      </Body>
      {openQRCode && cardCustom && (
        <QRCodeFlowCustom
        // // itens={itens}
        // // spool={spool}
        // // setSpool={setSpool}
        // // isOpen={openQRCode}
        // // currentSpool={currentSpool}
        // // action={findOnByCode}
        // // onClose={() => {
        // //   setOpenQRCode(false), setSpool(null);
        // }}
        />
      )}
      {openQRCode && !cardCustom && (
        <QRCodeFlow
          text={text}
          // itens={itens}
          // spool={spool}
          // setSpool={setSpool}
          // isOpen={openQRCode}
          // currentSpool={currentSpool}
          // action={(findOnByCode, handlerData)}
          // onClose={() => {
          //   setOpenQRCode(false), setSpool(null);
          // }}
        />
      )}
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
          //setData={setGetData}
        />
      )}
    </div>
  );
}
