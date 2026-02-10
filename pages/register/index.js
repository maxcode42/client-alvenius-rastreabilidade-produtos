//import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SaveIcon, QrCodeIcon, Trash2Icon, InfoIcon } from "lucide-react";

import withAuth from "../../src/auth/auth-with";

import Header from "../../components/header";
import Body from "../../components/body";
import Button from "components/ui/button";
import Table from "components/ui/table";

import QRCode from "components/ui/modal/qr-code";
import AlertConfirm from "components/ui/alert/confirm";
import api from "provider/api-web";
import AlertInfo from "components/ui/alert/info";

function Register() {
  const [itens, setItens] = useState([]);
  const [spool, setSpool] = useState(null);
  const [openQRCode, setOpenQRCode] = useState(false);

  const [openAlertInfo, setOpenAlertInfo] = useState(false);
  const [openAlert, setOpenAlert] = useState();
  const [message, setMessage] = useState("");

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
    e.preventDefault();

    const results = await api.createRegister({ data: { spool, itens } });

    setMessage(results?.Sucesso);
    setOpenAlertInfo(true);
  }

  useEffect(() => {}, [openQRCode, itens, spool]);

  return (
    <div className="w-full h-full bg-zinc-100">
      <Header />

      <Body>
        <div className="flex flex-col w-full px-4 py-6 md:mt-16 justify-start items-center h-full overflow-hidden">
          <section className="overflow-y-scroll md:overflow-hidden h-full sm:h-full sm:w-1/2 sm:min-h-[70vh] px-4 py-4 w-full flex flex-col gap-2 justify-start items-start border-blue-950/50 border-2 rounded-sm">
            <div className="w-full bg-stone-300/50">
              <h3 className="text-2xl text-center font-semibold py-2 ">
                Cadastro
              </h3>
              <div className="flex flex-row items-center gap-2 py-1 px-1">
                <InfoIcon size={16} className="text-blue-950/50" />
                <p className="text-xs">
                  Realizar o cadastro inicial do Spool e componentes.
                </p>
              </div>
            </div>
            <div className="text-xs sm:text-lg">
              <p className="mt-2 text-sm sm:text-lg break-all font-semibold ">
                Spool
              </p>
              <div className="text-xs sm:text-lg">
                <div className="flex flex-col ">
                  <p>
                    <span className="font-semibold">Código: </span>
                    <span className="font-normal">{spool?.codigo}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Descrição: </span>
                    <span className="font-normal truncate">
                      {spool?.descricao}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full h-full sm:h-1/2 flex flex-col sm:flex-col gap-4">
              <div className="w-full min-w-full h-70 min-h-64 sm:min-h-96 sm:h-96 sm:max-h-96 border-blue-950/50 border-2 rounded-sm overflow-auto">
                <Table items={itens} />
              </div>
              <div className="w-full sm:w-full h-16 flex gap-4 flex-row">
                <Button type="button" onClick={(e) => openModalQRCode(e)}>
                  <QrCodeIcon className="size-6 sm:size-8" />
                  <span className="text-sm sm:text-base truncate">
                    Escanear
                  </span>
                </Button>

                <Button
                  onClick={(e) => handleConfirmClear(e)}
                  disabled={itens.length === 0}
                >
                  <Trash2Icon className="size-6 sm:size-8" />
                  <span className="text-sm sm:text-base truncate"> Limpar</span>
                </Button>

                <Button
                  disabled={itens.length === 0 || openAlertInfo}
                  onClick={(e) => handleCreateRegister(e)}
                >
                  {openAlertInfo ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="fel flex row gap-2 justify-center items-center">
                      <SaveIcon className="size-6 sm:size-8" />
                      <span className="text-sm sm:text-base truncate">
                        Gravar
                      </span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Body>

      <QRCode
        isOpen={openQRCode}
        itens={itens}
        spool={spool}
        setItens={setItens}
        setSpool={setSpool}
        onClose={() => setOpenQRCode(false)}
      />

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
      />
    </div>
  );
}

export default withAuth(Register);
