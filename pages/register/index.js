//import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { SaveIcon, QrCodeIcon, Trash2Icon } from "lucide-react";

import Header from "../../components/header";
import Body from "../../components/body";
import Button from "components/ui/button";
import Table from "components/ui/table";
import AlertInfo from "components/ui/alert/info";
import AlertConfirm from "components/ui/alert/confirm";
import PanelDefault from "components/ui/panel-default";
import PanelPrimary from "components/ui/panel-primary";
import HeaderPageTitle from "components/header-page-title";
import HeaderPageText from "components/header-page-text";
import QRCode from "components/ui/modal/qr-code";

import { STATUS_CODE } from "types/status-code";
import withAuth from "../../auth/auth-with";

import api from "infra/provider/api-web";
import Separator from "components/ui/separator";
import TextSpool from "components/ui/text-spool";

function Register() {
  const [itens, setItens] = useState([]);
  const [spool, setSpool] = useState(null);
  const [openQRCode, setOpenQRCode] = useState(false);

  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [openAlert, setOpenAlert] = useState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const titles = useMemo(() => {
    return [
      "Item",
      "Código",
      "Quantidade",
      "Corrida",
      "Fornecedor",
      "Descrição",
    ];
  }, []);

  function openModalQRCode(e) {
    e.preventDefault();
    setOpenQRCode(true);
  }

  function clearData() {
    setSpool(null);
    setItens([]);
  }

  function handleConfirmClear(e) {
    e.preventDefault();

    setMessage(`Deseja limpar todos as informações escaneadas?`);
    setOpenAlert(true);
  }

  async function handleCreateRegister(e) {
    try {
      e.preventDefault();
      setLoading(true);
      const results = await api.execute.register.create({
        data: { spool, itens },
      });

      setOpenAlertInfo(true);

      if (results?.status_code !== STATUS_CODE.CREATE) {
        setMessage(results?.message);
        return;
      }

      setMessage(results?.message);
      clearData();
    } catch (error) {
      setOpenAlertInfo(true);
      setMessage("Error: Ocorreu uma falha ao gravar dados!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, [openQRCode, itens, spool]);

  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <PanelDefault>
          <HeaderPageTitle
            title={"Cadastro"}
            text={"Realizar o cadastro inicial do Spool e componentes."}
          />

          <Separator />

          <HeaderPageText>
            {/* <p className="mt-2 text-sm sm:text-lg break-all font-semibold ">
              SPOOL
            </p>
            <p>
              <span className="font-semibold">Código: </span>
              <span className="font-normal">{spool?.codigo}</span>
            </p>
            <p>
              <span className="font-semibold">Descrição: </span>
              <span className="font-normal truncate">{spool?.descricao}</span>
            </p> */}
            <TextSpool spool={spool} />
          </HeaderPageText>

          <PanelPrimary>
            <Table titles={titles} items={itens} />
          </PanelPrimary>

          <section className="w-full sm:w-full h-16 flex gap-2 flex-row">
            <Button type="button" onClick={(e) => openModalQRCode(e)}>
              <QrCodeIcon className="size-6 sm:size-8" />
              <span className="text-xs sm:text-base truncate">Ler QRCode</span>
            </Button>

            <Button
              onClick={(e) => handleConfirmClear(e)}
              disabled={itens.length === 0 && spool === null}
              className={
                "bg-red-500 text-red-100  hover:bg-red-700 hover:text-stone-100 hover:shadow-red-600 disabled:bg-stone-300 disabled:shadow-none"
              }
            >
              <Trash2Icon className="size-6 sm:size-8" />
              <span className="text-xs sm:text-base truncate"> Limpar</span>
            </Button>

            <Button
              disabled={itens.length === 0 || openAlertInfo || loading}
              onClick={(e) => handleCreateRegister(e)}
              className={
                "bg-green-500 text-green-100  hover:bg-green-700 hover:text-stone-100 hover:shadow-green-600 disabled:bg-stone-300 disabled:shadow-none"
              }
            >
              {openAlertInfo || loading ? (
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
      </Body>

      {openQRCode && (
        <QRCode
          isOpen={openQRCode}
          itens={itens}
          spool={spool}
          setItens={setItens}
          setSpool={setSpool}
          onClose={() => setOpenQRCode(false)}
        />
      )}
      {/* Alert */}
      <AlertConfirm
        action={clearData}
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
      />
      <AlertInfo
        message={message}
        openAlert={openAlertInfo}
        setOpenAlert={setOpenAlertInfo}
        setScannerLocked={() => {}}
      />
    </div>
  );
}

export default withAuth(Register);
