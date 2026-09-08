import { useEffect, useState, useRouter, useCallback } from "react";
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
import QRCodeTransfer from "components/ui/modal/qr-code-transfer-component";

import { QRCODE_TYPES } from "types/qr-code-reading";
import { STATUS_CODE } from "types/status-code";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";
import HeaderPageText from "components/header-page-text";
import TextSupplier from "components/ui/text-supplier";
import TableTransfer from "components/ui/table-transfer";
import { PROCESS_FLOW } from "types/process-flow";

export default function ProcessTransferComponentCreate({
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

  // const router = useRouter();
  const { params } = "CA"; //router.query;

  const routeAcronym = ""; //PROCESS_FLOW.route[params].acronym;
  const routeName = ""; //PROCESS_FLOW.name[routeAcronym];
  const [suppliers, setSuppliers] = useState(null);
  const [data, setData] = useState({
    supplier_destination: null,
    supplier_origin: null,
    spools: null,
    process: null,
    third: false,
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
    setQrCodeReadingType([QRCODE_TYPES.component]);
    setCheckCodeExists(false);
    setNewStatus(null);
    setResult(null);
  }

  function clearData() {
    setQrCodeReadingType([QRCODE_TYPES.component]);
    //setOpenAlertInfo(false);
    setCurrentSpool(null);
    setSpool(null);
    setData({
      supplier_destination: null,
      supplier_origin: null,
      process: null,
      spools: null,
      itens: null,
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
      ].component.create({
        data: {
          itens: data?.itens,
          process: data?.process,
          third: data?.third ? "S" : "N",
          supplier_origin: data?.supplier_origin?.code,
          supplier_destination: data?.supplier_destination.code,
        },
        params: routeAcronym,
      });

      setMessage(results?.message);

      if (results?.status_code !== STATUS_CODE.CREATE) return;

      clearData();
    } catch (error) {
      setMessage("Error: Ocorreu uma falha ao gravar dados!");

      console.error(error);
    } finally {
      setLoading(false);
      setOpenAlert(true);
      setOpenAlertInfo(true);
    }
  }

  const fetchData = useCallback(async () => {
    const route_supplier = PROCESS_FLOW.route.supplier.name;
    const acronym = {
      current: "CA", //PROCESS_FLOW.route[params].acronym,
      next: "RR", //PROCESS_FLOW.route[params].acronym_next,
    };

    const supplier_origin = await api.execute[route_supplier].read(
      acronym.current,
    );
    const supplier_destination = await api.execute[route_supplier].read(
      acronym.next,
    );

    setSuppliers({
      origin: supplier_origin,
      destination: supplier_destination,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignDefaultStandards = useCallback(() => {
    setQrCodeReadingType([QRCODE_TYPES.component]);
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
          <h2 className="text-md sm:text-lg break-all font-bold pb-2">
            FORNECEDOR
          </h2>
          <TextSupplier title="Origem" supplier={data?.supplier_origin} />
          <br />
          <TextSupplier title="Destino" supplier={data?.supplier_destination} />
        </HeaderPageText>

        <div className={`flex flex-col justify-center gap-1 py-4`}>
          <label className="w-full flex flex-row item-center gap-2 font-semibold">
            <CircleQuestionMarkIcon
              className="text-stone-400 mr-2 mt-0.5"
              size={18}
            />
            Serviço realizado por terceiro?
          </label>
          <p className="px-8">{!data?.third ? "SIM" : "NÃO"}</p>
        </div>

        <PanelPrimary className="mt-2">
          <TableTransfer items={data?.itens} title="Componentes" />
        </PanelPrimary>

        <section className="w-full sm:w-full h-16 flex gap-2 flex-row">
          <Button type="button" onClick={(e) => openModalQRCode(e)}>
            <QrCodeIcon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate">Ler QRCode</span>
          </Button>

          <Button
            onClick={(e) => handleConfirmClear(e)}
            disabled={!data?.itens && !data?.supplier}
            className={
              "bg-red-500 text-red-100  hover:bg-red-700 hover:text-stone-100 hover:shadow-red-600 disabled:bg-stone-300 disabled:shadow-none"
            }
          >
            <Trash2Icon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate"> Limpar</span>
          </Button>

          <Button
            disabled={(!data?.itens && !data?.supplier) || loading}
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
        <QRCodeTransfer
          data={data}
          setData={setData}
          suppliers={suppliers}
          types="componente"
        />
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
