import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArchiveXIcon, PlusCircleIcon } from "lucide-react";

import LayoutPage from "components/layout-page";
import Search from "components/ui/search";
import Loading from "components/ui/loading";
import AlertCustom from "components/ui/alert";
import Separator from "components/ui/separator";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import CardItemsTransfer from "components/ui/card-items-transfer";

import { formatCodeDefault } from "util/formatters/code";
import { formatToPtBR } from "util/formatters/date";

import { PROCESS_FLOW } from "types/process-flow";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";

export default function ProcessTransferFlow({ title = "", info = "", route }) {
  const { currentSpool } = useQRCode();

  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [itensFiltered, setItensFiltered] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState(null);

  const router = useRouter();
  const { params } = router.query;

  const routeAcronym = useMemo(() => {
    if (!router.isReady) return;

    return PROCESS_FLOW.route[params].acronym;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const routeName = PROCESS_FLOW.name[routeAcronym];

  const fetchData = useCallback(async () => {
    const results = await api.execute[route].read(routeAcronym);

    setItens([]);
    setItens(results);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          //const status = item?.status;
          const code = item?.code;
          // const codeFormat = formatCodeDefault(item?.code);
          // const dateStart = formatToPtBR(item?.dateStart);
          // const dateEnd = formatToPtBR(item?.dateEnd);

          const itemFiltered = code.includes(searchText?.toUpperCase()); //||
          // codeFormat.includes(searchText?.toUpperCase()) ||
          // status.includes(searchText?.toLowerCase()) ||
          // dateStart?.includes(searchText) ||
          // dateEnd?.includes(searchText);

          return itemFiltered;
        });

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

  useEffect(() => {
    if (itens?.length >= 0) return;

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  useEffect(() => {
    const time = setTimeout(() => {
      handleSearch(null);
    }, 1_000);

    return () => clearTimeout(time);
  }, [searchText, handleSearch]);

  return (
    <LayoutPage title={true} subTitle={routeName}>
      <PanelDefault>
        <HeaderPageTitle title={title} text={info} />

        <section className="w-full h-16 flex gap-4 flex-row justify-end items-center">
          <Search text={searchText} action={setSearchText} />

          <div className="w-1/2 md:w-1/4 sm:w-full h-16 flex gap-4 flex-row">
            <Link
              alt="criar romaneio"
              href={`/transfer/create?params=${params}`}
              className="w-full py-4 mt-2 rounded-sm text-lg text-center flex flex-row gap-2 
                justify-center items-center bg-blue-700 text-blue-100  
                hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600/50 hover:shadow-md
                disabled:bg-stone-300"
              title="Criar novo romaneio"
            >
              <PlusCircleIcon className="size-6 sm:size-8" />
              <span className="flex flex-col">
                <span className="text-xs sm:text-base">Novo</span>
                <span className="text-xs sm:text-base">Romaneio</span>
              </span>
            </Link>
          </div>
        </section>

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
            <CardItemsTransfer items={itensFiltered}>
              {/* <QuantitiesItens data={quantities} /> */}
            </CardItemsTransfer>
          )}
        </PanelPrimary>
      </PanelDefault>

      {openAlertInfo && (
        <AlertCustom
          action={null}
          actionClose={() => {
            setOpenAlertInfo(false);
          }}
          title="Informação"
          type="info"
        />
      )}
    </LayoutPage>
  );
}
