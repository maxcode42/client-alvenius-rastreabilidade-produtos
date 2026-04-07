import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import {
  SaveIcon,
  QrCodeIcon,
  Trash2Icon,
  CircleQuestionMarkIcon,
} from "lucide-react";

import LayoutPage from "components/layout-page";
import Button from "components/ui/button";
import AlertCustom from "components/ui/alert";
import Separator from "components/ui/separator";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import HeaderPageText from "components/header-page-text";
import TextSupplier from "components/ui/text-supplier";
import TableTransfer from "components/ui/table-transfer";
import QRCodeTransfer from "components/ui/modal/qr-code-transfer";

import { QRCODE_TYPES } from "types/qr-code-reading";
import { PROCESS_FLOW } from "types/process-flow";
import { STATUS_CODE } from "types/status-code";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";

export default function ProcessTransferCreate({
  title = "",
  info = "",
  route,
}) {
  const {
    setQrCodeReadingType,
    setCheckCodeExists,
    setCurrentProcess,
    setScannerLocked,
    setCurrentSpool,
    setOpenQRCode,
    setNewStatus,
    setOpenAlert,
    setOnClose,
    openQRCode,
    setMessage,
    setAction,
    setResult,
    setSpool,
  } = useQRCode();

  const [openAlertQuestion, setOpenAlertQuestion] = useState(false);
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { params } = router.query;

  const routeAcronym = PROCESS_FLOW.route[params].acronym;
  const routeName = PROCESS_FLOW.name[routeAcronym];
  const [suppliers, setSuppliers] = useState(null);
  const [data, setData] = useState({
    supplier: null,
    spools: null,
    process: null,
    third: true,
  });

  function openModalQRCode(e) {
    e.preventDefault();

    setResult(null);
    setOpenQRCode(true);
    setCheckCodeExists(true);
    setScannerLocked(true);

    setSpool(null);
    setOpenAlert(false);
    // setCurrentProcess(currentRoute.replace("/", ""));
    setCurrentProcess(params);
  }

  function resetDataDefault() {
    setQrCodeReadingType([QRCODE_TYPES.spool]);
    setCheckCodeExists(false);
    setNewStatus(null);
    setResult(null);
    // setData({
    //   supplier: null,
    //   spools: null,
    //   process: null,
    //   third: true
    // });
  }

  function clearData() {
    setQrCodeReadingType([QRCODE_TYPES.spool]);
    //setOpenAlertInfo(false);
    setCurrentSpool(null);
    setSpool(null);
    setData({
      supplier: null,
      spools: null,
      process: null,
      third: true,
    });
  }

  function handleConfirmClear(e) {
    e.preventDefault();

    setMessage(`Deseja limpar todos as informações escaneadas?`);
    setOpenAlertQuestion(true);
    setOpenAlert(true);
  }

  async function findOnByCode({ code }) {
    const results = await api.execute[params].find({ params: code });

    return results?.data?.[0] ?? {};
  }

  async function handlerData(e) {
    if (!data) return;

    try {
      e.preventDefault();

      setLoading(true);

      const results = await api.execute[
        PROCESS_FLOW.route.transfer.name
      ].create({
        data: {
          spools: data?.spools,
          supplier: data?.supplier?.code,
          process: data?.process,
          third: data?.third ? "S" : "N",
        },
        params: routeAcronym,
      });

      if (results?.status_code !== STATUS_CODE.CREATE) {
        setMessage(results?.message);
        setOpenAlertInfo(true);
        setOpenAlert(true);
        return;
      }

      setMessage(results?.message);
      setOpenAlertInfo(true);
      setOpenAlert(true);
      clearData();
    } catch (error) {
      setMessage("Error: Ocorreu uma falha ao gravar dados!");
      setOpenAlertInfo(true);
      setOpenAlert(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchData = useCallback(async () => {
    const results = await api.execute["supplier"].read(routeAcronym);

    setSuppliers([]);
    setSuppliers(results);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignDefaultStandards = useCallback(() => {
    setQrCodeReadingType([QRCODE_TYPES.spool]);
    setData({ ...data, process: routeAcronym });
    fetchData();

    setOnClose(() => {
      return () => {
        setOpenQRCode(false), setScannerLocked(true), resetDataDefault();
      };
    });

    setAction(() => findOnByCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    assignDefaultStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  // VERIFICAR A NECESSIDADE DE USAR ESSE EFFECT
  useEffect(() => {}, [data]);

  return (
    <LayoutPage title={true} subTitle={routeName}>
      <PanelDefault>
        <HeaderPageTitle title={title} text={info} />

        <Separator />

        <HeaderPageText>
          <TextSupplier supplier={data?.supplier} />
        </HeaderPageText>

        <div className={`flex flex-col justify-center gap-1 py-4`}>
          <label className="w-full flex flex-row item-center gap-2 font-semibold">
            <CircleQuestionMarkIcon
              className="text-stone-400 mr-2 mt-0.5"
              size={18}
            />
            Serviço realizado por terceiro?
          </label>
          <p className="px-8">{data?.third ? "SIM" : "NÃO"}</p>
        </div>

        <PanelPrimary className="mt-2">
          <TableTransfer items={data?.spools} />
        </PanelPrimary>

        <section className="w-full sm:w-full h-16 flex gap-2 flex-row">
          <Button type="button" onClick={(e) => openModalQRCode(e)}>
            <QrCodeIcon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate">Ler QRCode</span>
          </Button>

          <Button
            onClick={(e) => handleConfirmClear(e)}
            disabled={!data?.spools && !data?.supplier}
            className={
              "bg-red-500 text-red-100  hover:bg-red-700 hover:text-stone-100 hover:shadow-red-600 disabled:bg-stone-300 disabled:shadow-none"
            }
          >
            <Trash2Icon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate"> Limpar</span>
          </Button>

          <Button
            disabled={(!data?.spools && !data?.supplier) || loading}
            onClick={(e) => handlerData(e)}
            className={
              "bg-green-500 text-green-100  hover:bg-green-700 hover:text-stone-100 hover:shadow-green-600 disabled:bg-stone-300 disabled:shadow-none"
            }
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="fel flex row gap-2 justify-center items-center">
                <SaveIcon className="size-6 sm:size-8" />
                <span className="text-xs sm:text-base truncate">Gravar</span>
              </span>
            )}
          </Button>
        </section>
      </PanelDefault>

      {openQRCode && (
        <QRCodeTransfer data={data} setData={setData} suppliers={suppliers} />
      )}

      {openAlertQuestion && (
        <AlertCustom
          action={clearData}
          actionClose={() => {
            setOpenAlertQuestion(false);
          }}
          title="Questão"
          type="confirm"
        />
      )}

      {openAlertInfo && (
        <AlertCustom
          // actionClose={() => {
          //   setOpenAlertInfo(false), clearData();
          // }}
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
