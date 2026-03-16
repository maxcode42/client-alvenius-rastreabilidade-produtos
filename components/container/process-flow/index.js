import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArchiveXIcon } from "lucide-react";

import Header from "../../header";
import Body from "../../body";
import CardItems from "../../ui/card-items";
import PanelDefault from "../../ui/panel-default";
import PanelPrimary from "../../ui/panel-primary";
import HeaderPageTitle from "../../header-page-title";
import HeaderPageButtons from "../../header-page-buttons";

import QRCodeFlow from "../../ui/modal/qr-code-flow";
import AlertInfo from "../../ui/alert/info";

import QuantitiesItens from "components/ui/quantities-itens";
import Separator from "components/ui/separator";
import Loading from "components/ui/loading";

import { PROCESS_FLOW } from "types/process-flow";

import { normalizeAlphanumeric } from "util/formatters/text";
import { formatCodeDefault } from "util/formatters/code";
import { formatToPtBR } from "util/formatters/date";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";

export default function ProcessFlow({
  //textModal = "",
  title = "",
  info = "",
  route,
}) {
  const {
    setCheckCodeExists,
    setCurrentProcess,
    setScannerLocked,
    setCurrentSpool,
    setOpenQRCode,
    currentSpool,
    setNewStatus,
    setOpenAlert,
    setOnClose,
    openAlert,
    setAction,
    newStatus,
    setResult,
    setSpool,
    message,
    setData,
    data,
  } = useQRCode();

  const [itensFiltered, setItensFiltered] = useState(null);
  const [quantities, setQuantities] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState(null);
  const currentRoute = usePathname();

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

    // console.log(">>PROCESS-FLOW findInByCode IS CHECKING");
    // console.log(code);
    // console.log(results?.data?.[0]);
    return results?.data?.[0] ?? {};
  }

  function openModalQRCode(e) {
    e.preventDefault();

    setResult(null);
    setOpenQRCode(true);
    setOpenAlert(false);
    setCurrentSpool(null);
    setCheckCodeExists(true);
    setScannerLocked(false);
    setCurrentProcess(currentRoute.replace("/", ""));
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
          return;
        }

        if (!itensFiltered) {
          setItensFiltered(itens);
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
    // setOpenAlert(false);
    // setOnClose(() => {
    //   return () => {
    //     setOpenQRCode(false), setScannerLocked(true), setCheckCodeExists(false);
    //   };
    // });
    setOnClose(() => {
      return () => {
        setOpenQRCode(false), setScannerLocked(true), resetDataDefault();
      };
    });

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

    setLoading(true);
    handlerData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

  useEffect(() => {
    // setOpenAlert(false);
    assignDefaultStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

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
            //setCurrentSpool={setCurrentSpool}
            openModalQRCode={openModalQRCode}
          />

          <Separator />

          <PanelPrimary className={`border-none`}>
            {(loading || !itens) && <Loading />}

            {!loading && itens?.length === 0 && (
              <div
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

            {!loading && (
              <CardItems items={itensFiltered}>
                <QuantitiesItens data={quantities} />
              </CardItems>
            )}
          </PanelPrimary>
        </PanelDefault>
      </Body>

      <QRCodeFlow />

      {openAlert && (
        <AlertInfo
          action={null}
          message={message}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setScannerLocked={setScannerLocked}
        />
      )}
    </div>
  );
}
