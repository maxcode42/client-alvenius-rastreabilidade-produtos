import { useCallback, useEffect, useState } from "react";
import { ArchiveXIcon } from "lucide-react";

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

import QRCodeQuestion from "components/ui/modal/qr-code-question";
import Loading from "components/ui/loading";
import Separator from "components/ui/separator";

import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";

import { normalizeAlphanumeric } from "util/formatters/text";
import { formatCodeDefault } from "util/formatters/code";
import { formatToPtBR } from "util/formatters/date";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";
import QuantitiesItens from "components/ui/quantities-itens";

const cardCustom = Boolean(
  process.env.NEXT_PUBLIC_APP_CARD_CUSTOM?.toLowerCase() === "true",
);

export default function ProcessFlow({
  textModal = "",
  title = "",
  info = "",
  route,
}) {
  const [text, setText] = useState("");

  const {
    setCheckCodeExists,
    setScannerLocked,
    setCurrentSpool,
    setOpenQRCode,
    currentSpool,
    setNewStatus,
    setOpenAlert,
    setOnClose,
    openQRCode,
    openAlert,
    setAction,
    newStatus,
    setResult,
    setSpool,
    message,
    setData,
    data,
    //spool,
  } = useQRCode();

  const [isOpenQuestion, setIsOpenQuestion] = useState(false);
  const [itensFiltered, setItensFiltered] = useState(null);
  const [quantities, setQuantities] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState(null);

  async function findOnByCode({ code }) {
    //= "SP0414FL005003") {
    const results = await api.execute[route].find({ params: code });
    // const results = {
    //   data: [
    //     {
    //       codigo: "SP041500345003",
    //       dateEnd: "",
    //       dateStart: "20260302",
    //       descricao: "Carretel FS+FF 16pol x 6,35 x 4500mm 150 PSI",
    //       process: "caldeiraria",
    //       process_acronym: "CA",
    //       sequence: "0001",
    //       status: "execução",
    //       status_acronym: "FI",
    //       timeEnd: "",
    //       timeStart: "17:02",
    //       user: "josuel",
    //     },
    //   ],
    //   quantities: [{}],
    //   total: 1,
    // };

    // console.log(">>PROCESS-FLOW findInByCode IS CHECKING AQUI");
    // console.log(code);
    // console.log(results?.data?.[0]);
    return results?.data?.[0] ?? {};
  }

  async function openModalQRCode(e) {
    e.preventDefault();

    //await setCurrentSpool(item);
    await setResult(null);
    await setScannerLocked(false);
    await setOpenQRCode(true);
    // }
    // function openModalQRCode(e) {
    //   e.preventDefault();
    //setText("para buscar o SPOOL e seguir fluxo do");
    setText(textModal);
    setOpenAlert(false);
    //setOpenQRCode(true);
  }

  function resetDataDefault() {
    setCheckCodeExists(false);
    setItensFiltered(null);
    setCurrentSpool(null);
    setNewStatus(null);
    setResult(null);
    setItens(null);
    setSpool(null);
    setData({
      accordance: true,
      reversible: false,
      qualityText: "",
    });
  }

  async function handlerData() {
    if (!currentSpool) return;

    const objectData = {
      codigo: normalizeAlphanumeric(currentSpool?.codigo),
      processo: PROCESS_FLOW.route[route].acronym,
      conformidade: data?.accordance ? "S" : "N",
      reversivel: data?.reversible ? "S" : "N",
      disposicao_qualidade: data?.qualityText ?? "",
      status:
        data?.reversible === true && PROCESS_FLOW.acronym.romaneio === newStatus
          ? PROCESS_FLOW.acronym.reversible
          : newStatus,
    };

    // console.log(">>PROCESS FLOW: HANDLER_DATA");
    // console.log(objectData);
    await api.execute[route].create({
      data: objectData,
    });

    resetDataDefault();
  }

  const fetchData = useCallback(async () => {
    const results = await api.execute[route].read();

    setItens([]);
    setItens(results.data);
    setQuantities({
      items: results?.quantities,
      total: results?.total,
    });
  }, [route]);

  const handleSearch = useCallback(
    async (e) => {
      try {
        if (e) {
          e.preventDefault();
        }

        if (
          ((!itens || !itens?.length || itens?.length === 0) &&
            !currentSpool) ||
          (searchText.length > 0 && searchText.length < 3)
        ) {
          //setLoading(false);
          return;
        }

        // console.log(itensFiltered);

        if (!itensFiltered) {
          setItensFiltered(itens);
          //setLoading(false);
          return;
        }

        const filtered = itens?.filter((item) => {
          const status = item?.status;
          const code = item?.codigo;
          const codeFormat = formatCodeDefault(item?.codigo);
          const dateStart = formatToPtBR(item?.dateStart);
          const dateEnd = formatToPtBR(item?.dateEnd);

          const itemFiltered =
            code.includes(searchText?.toUpperCase()) ||
            codeFormat.includes(searchText?.toUpperCase()) ||
            status.includes(searchText?.toLowerCase()) ||
            dateStart?.includes(searchText) ||
            dateEnd?.includes(searchText);

          return itemFiltered;
        });
        // const filtered = itens?.reduce((acc, item) => {
        //   const status = item?.status ?? "";
        //   const code = item?.codigo ?? "";
        //   const codeFormat = formatCodeDefault(code) ?? "";
        //   const dateStart = formatToPtBR(item?.dateStart) ?? "";
        //   const dateEnd = formatToPtBR(item?.dateEnd) ?? "";

        //   const match =
        //     code.includes(searchText.toUpperCase()) ||
        //     codeFormat.includes(searchText.toUpperCase()) ||
        //     status.includes(searchText.toLowerCase()) ||
        //     dateStart.includes(searchText) ||
        //     dateEnd.includes(searchText);

        //   if (match) {
        //     acc.push({
        //       ...item,
        //       status_color: styleColorStatus(item?.status_acronym),
        //     });
        //   }
        //   console.log(acc);
        //   return acc;
        // }, []);

        setItensFiltered(filtered);
      } catch (error) {
        console.log(`ERROR: Controller ${route}, list in filter items."`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itens, searchText],
  );

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
        setOpenQRCode(false), setScannerLocked(true), setCheckCodeExists(false);
      };
    });
    // FUNCIONA
    // setAction(() => () => handlerData());

    // 08-0-2026 NEW IMPLEMENTS
    setAction(() => findOnByCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (!newStatus) return;

    if (newStatus === PROCESS_STATUS.acronym.romaneio && !cardCustom) {
      setIsOpenQuestion(true);
      return;
    }

    setLoading(true);
    handlerData();
    // setNewStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

  useEffect(() => {
    assignDefaultStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //if (!itens) return null;

  //EXIBE A ESTRUTURA DA TELA
  // function SkeletonRow() {
  //   return (
  //     <div className="animate-pulse flex justify-between items-center py-2">
  //       <div className="h-4 bg-stone-300 rounded w-2/3"></div>
  //       <div className="h-4 bg-stone-300 rounded w-12"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />
      {/* 
            //EXIBE A ESTRUTURA DA TELA
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)} */}
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
            {(!itens || !itens?.length) && loading && <Loading />}

            {itens?.length === 0 && !loading && (
              <div
                //className="w-full h-full flex flex-col min-h-72 flex-1 px-2 py-8 gap-8 border-blue-300/50 border-2 rounded-md text-center"
                className={`w-full h-full flex flex-col min-h-72 flex-1 px-2 py-8 gap-8 border-blue-300/50 border-2 rounded-md text-center
                            opacity-0
                            translate-y-4
                            animate-scaleInCenter
                            [animation-delay:${120}ms]
                            animation-fill-mode:forwards
                          `}
              >
                <div
                  className={`flex flex-col justify-center items-center
                              opacity-0
                            translate-y-4
                            animate-scaleInCenter
                            [animation-delay:${600}ms]
                            animation-fill-mode:forwards
                          `}
                >
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
                >
                  <QuantitiesItens data={quantities} />
                </CardItemsCustom>
              ) : (
                <CardItems
                  setText={setText}
                  items={itensFiltered}
                  //setOpenQRCode={setOpenQRCode}
                  //setCurrentSpool={setCurrentSpool}
                  //setNewStatus={setNewStatus}
                >
                  <QuantitiesItens data={quantities} />
                </CardItems>
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
          resetDataDefault={resetDataDefault}
          handlerData={handlerData}
        />
      )}
    </div>
  );
}
