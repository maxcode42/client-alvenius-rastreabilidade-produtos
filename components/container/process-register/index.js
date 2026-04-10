import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { SaveIcon, QrCodeIcon, Trash2Icon } from "lucide-react";

import LayoutPage from "components/layout-page";
import Table from "components/ui/table";
import Button from "components/ui/button";
import AlertCustom from "components/ui/alert";
import Separator from "components/ui/separator";
import TextSpool from "components/ui/text-spool";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import HeaderPageText from "components/header-page-text";
import QRCodeRegister from "components/ui/modal/qr-code-register";

import { QRCODE_TYPES } from "types/qr-code-reading";
import { STATUS_CODE } from "types/status-code";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";

export default function ProcessRegister({ title = "", info = "", route }) {
  const {
    setQrCodeReadingType,
    setCheckCodeExists,
    setCurrentProcess,
    setScannerLocked,
    setCurrentSpool,
    setOpenQRCode,
    setNewStatus,
    setOpenAlert,
    currentSpool,
    setOnClose,
    openQRCode,
    setMessage,
    setAction,
    setResult,
    setSpool,
    setItens,
    setData,
    spool,
    itens,
  } = useQRCode();

  const [openAlertQuestion, setOpenAlertQuestion] = useState(false);
  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentRoute = usePathname();

  function openModalQRCode(e) {
    e.preventDefault();

    setResult(null);
    setOpenQRCode(true);
    setCheckCodeExists(false);
    setScannerLocked(false);

    setSpool(null);
    setOpenAlert(false);
    setCurrentProcess(currentRoute.replace("/", ""));
  }

  function resetDataDefault() {
    setQrCodeReadingType([QRCODE_TYPES.spool, QRCODE_TYPES.component]);
    setCheckCodeExists(false);
    setNewStatus(null);
    setResult(null);
    setData({
      accordance: true,
      reversible: false,
      qualityText: "",
    });
  }

  function clearData() {
    setQrCodeReadingType([QRCODE_TYPES.spool, QRCODE_TYPES.component]);
    //setOpenAlertInfo(false);
    setCurrentSpool(null);
    setSpool(null);
    setItens([]);
  }

  function handleConfirmClear(e) {
    e.preventDefault();

    setMessage(`Deseja limpar todos as informações escaneadas?`);
    setOpenAlertQuestion(true);
    setOpenAlert(true);
  }

  async function handleCreateRegister(e) {
    try {
      e.preventDefault();
      setLoading(true);

      const results = await api.execute[route].create({
        data: { spool: currentSpool, itens },
      });

      if (results?.status_code !== STATUS_CODE.CREATE) {
        setMessage(results?.message);
        return;
      }

      setMessage(results?.message);
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

  const assignDefaultStandards = useCallback(() => {
    setQrCodeReadingType([QRCODE_TYPES.spool, QRCODE_TYPES.component]);

    setOnClose(() => {
      return () => {
        setOpenQRCode(false), setScannerLocked(true), resetDataDefault();
      };
    });

    setAction(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    assignDefaultStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <LayoutPage title={true} subTitle={title}>
      <PanelDefault>
        <HeaderPageTitle title={"SPOOL"} text={info} />

        <Separator />

        <HeaderPageText>
          <TextSpool spool={currentSpool} />
        </HeaderPageText>

        <PanelPrimary className="mt-2">
          <Table items={itens} />
        </PanelPrimary>

        <section className="w-full sm:w-full h-16 flex gap-2 flex-row">
          <Button type="button" onClick={(e) => openModalQRCode(e)}>
            <QrCodeIcon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate">Ler QRCode</span>
          </Button>

          <Button
            onClick={(e) => handleConfirmClear(e)}
            disabled={itens?.length === 0 && spool === null}
            className={
              "bg-red-500 text-red-100  hover:bg-red-700 hover:text-stone-100 hover:shadow-red-600 disabled:bg-stone-300 disabled:shadow-none"
            }
          >
            <Trash2Icon className="size-6 sm:size-8" />
            <span className="text-xs sm:text-base truncate"> Limpar</span>
          </Button>

          <Button
            disabled={itens?.length === 0 || loading}
            onClick={(e) => handleCreateRegister(e)}
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
      {/* </Body> */}

      {openQRCode && <QRCodeRegister />}

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
