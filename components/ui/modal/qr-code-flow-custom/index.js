import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";

import Input from "components/ui/input";
import Separator from "components/ui/separator";
import QRCode from "components/ui/qr-code";
import QRCodePanel from "components/ui/qr-code/qr-code-panel";
import TextSpool from "components/ui/text-spool";

export default function QRCodeFlowCustom({
  currentSpool = null,
  setSpool,
  onClose,
  isOpen,
  action,
  spool,
}) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const [scannerLocked, setScannerLocked] = useState(false);

  const [accordance, setAccordance] = useState(false);
  const [reversible, setReversible] = useState(false);
  const [qualityText, setQualityText] = useState("");
  const [isMaxHeightText, setIsMaxHeightText] = useState(false);
  const maxTextArea = useMemo(() => {
    return {
      characters: 120,
      lines: 3,
    };
  }, []);

  function getStatusText(sigle) {
    const statusText = {
      RE: () => {
        return "Iniciar";
      },
      EX: () => {
        return "Pausar ou Finalizar";
      },
      PU: () => {
        return "Continuar";
      },
      FI: () => {
        return "Qualificar";
      },
      RV: () => {
        return "Reservar";
      },
      SU: () => {
        return "Descartar";
      },
      RO: () => {
        return "Romaneio";
      },
      default: () => {
        return "para seguir";
      },
    };

    const ex = statusText[sigle || "default"];

    return ex();
  }

  function limitLines(e) {
    e.preventDefault();
    const textarea = e.target;
    const lines = textarea.value.split("\n").length;

    if (
      lines > maxTextArea.lines ||
      String(e.target.value).length === maxTextArea.characters
    ) {
      setIsMaxHeightText(true);
      return;
    }

    setQualityText(textarea.value);
    setIsMaxHeightText(false);
  }

  function normalizedText(text) {
    return new TextDecoder("utf-8")
      .decode(new TextEncoder().encode(text))
      .normalize("NFC");
  }

  const parseQrSpoolToJson = useCallback((text) => {
    const normalized = normalizedText(text);
    const match = normalized
      .trim()
      .match(/^(SP-[A-Za-z0-9]{4}-[A-Za-z0-9]{5}-[A-Za-z0-9]{3})\s+(.*)$/);
    if (!match) {
      setMessage("Escanear um QRCode do SPOOL, ou este QRCODE é inválido!");
      setOpenAlert(true);
      return null;
    }
    return { codigo: match[1], descricao: match[2] };
  }, []);

  const checkIfCodeExists = useCallback(
    async (code) => {
      //console.log(`[checkCODE]: ${code}`);
      if (!currentSpool) {
        await action(code);

        return;
      }

      if (currentSpool?.codigo !== code) {
        setMessage(
          `O código escaneado é diferente, escanei o QRCode do SPOOL código: ${currentSpool?.codigo}`,
        );
        setOpenAlert(true);
      }
    },
    [action, currentSpool],
  );

  const handleQrDecoded = useCallback(async () => {
    if ((!spool && !result) || spool !== null) {
      return;
    }

    const parsedSpool = parseQrSpoolToJson(result);
    if (parsedSpool) {
      setMessage(`Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`);
      setSpool(parsedSpool);
      setOpenAlert(true);

      //await action(parsedSpool.codigo);
      await checkIfCodeExists(parsedSpool.codigo);
    }
  }, [parseQrSpoolToJson, checkIfCodeExists, setSpool, spool, result]);

  useEffect(() => {}, [isMaxHeightText]);

  useEffect(() => {
    handleQrDecoded();
  }, [handleQrDecoded]);

  if (!isOpen) return null;

  return (
    <QRCodePanel>
      <QRCode
        setScannerLocked={setScannerLocked}
        scannerLocked={scannerLocked}
        setOpenAlert={setOpenAlert}
        setMessage={setMessage}
        setResult={setResult}
        setSpool={setSpool}
        result={result}
        message={message}
        openAlert={openAlert}
        spool={spool}
        currentSpool={currentSpool}
        onClose={onClose}
      >
        <div className="flex flex-col py-2">
          <p className="text-sm font-semibold text-center">
            Ler o QRCode do Spool.
          </p>
          <p className="text-sm font-semibold text-center">
            <strong className="text-md font-bold uppercase">
              {getStatusText(currentSpool?.status_sigle)}
            </strong>{" "}
            processo produto.
          </p>
        </div>
        {/* <div className="flex flex-col border-2 border-stone-300/50 w-full rounded-full" /> */}
        <Separator />
        {spool && (
          <div className="flex flex-col py-5">
            <TextSpool spool={spool} />

            {String(currentSpool?.status_sigle).toUpperCase() === "FI" && (
              <div className="flex flex-col py-2">
                {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-4 mb-4 rounded-full" /> */}
                <Separator cssCustom={"via-stone-300/50"} />
                <div className="flex flex-col justify-center gap-1 py-4">
                  <label className="w-full flex flex-row item-center gap-1">
                    <CircleQuestionMarkIcon
                      className="text-stone-400 mr-2 mt-0.5"
                      size={18}
                    />
                    Produto está conforme?
                  </label>
                  <div className="flex flex-row justify-around">
                    <Input
                      id="conforme"
                      name="conforme"
                      type="radio"
                      value={""}
                      label="Sim"
                      onChange={() => {}}
                      className="w-1/2 flex flex-row"
                    ></Input>
                    <Input
                      id="conforme"
                      name="conforme"
                      type="radio"
                      value={""}
                      label="Não"
                      onChange={() => {}}
                    ></Input>
                  </div>
                  {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" /> */}
                </div>
                <Separator cssCustom={"via-stone-300/50"} />
                <div className="flex flex-col justify-center gap-1 py-4">
                  <label className="w-full flex flex-row item-center gap-1">
                    <CircleQuestionMarkIcon
                      className="text-stone-400 mr-2 mt-0.5"
                      size={18}
                    />
                    Produto é reversível?
                  </label>
                  <div className="flex flex-row justify-around">
                    <Input
                      id="reversible"
                      name="reversible"
                      type="radio"
                      value={accordance}
                      label="Sim"
                      onChange={(e) => setAccordance(e.target.value)}
                      className="w-1/2 flex flex-row"
                    ></Input>
                    <Input
                      id="reversible"
                      name="reversible"
                      type="radio"
                      value={reversible}
                      label="Não"
                      disabled={!accordance}
                      onChange={(e) => setReversible(e.target.value)}
                      className="disabled:cursor-not-allowed"
                    ></Input>
                  </div>
                  {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" /> */}
                </div>
                <Separator cssCustom={"via-stone-300/50"} />
                {/* <Input
                  id="descrição"
                  type="text"
                  value={""}
                  label="Descrição qualidade produto"
                  placeholder="Digite breve descrição qualidade produto."
                  onChange={() => {}}
                >
                  <FilePenLineIcon
                    className="text-stone-400 mr-2 mt-0.5"
                    size={18}
                  />
                </Input> */}
                <div className="flex flex-col justify-center gap-1 py-4">
                  <label
                    id="descrição"
                    type="text"
                    label="Descrição qualidade produto"
                    placeholder="Digite disposição qualidade produto."
                    className="flex flex-row w-full gap-1 py-2"
                  >
                    <FilePenLineIcon
                      className="text-stone-400 mr-2 mt-0.5"
                      size={18}
                    />
                    Disposição qualidade produto.
                  </label>
                  <p
                    className={`text-xs text-red-600 mb-2 ${!isMaxHeightText ? "hidden" : ""}`}
                  >
                    <span>
                      * Limite máximo de{" "}
                      <strong>{maxTextArea.characters}</strong> caracteres ou{" "}
                      <strong>{maxTextArea.lines}</strong> linhas.
                    </span>
                  </p>
                  <textarea
                    rows={maxTextArea.lines}
                    value={qualityText}
                    maxLength={maxTextArea.characters}
                    onChange={(e) => limitLines(e)}
                    placeholder="Digite texto direto e objetivo para disposição qualidade."
                    className="overflow-y-scroll leading-6 w-full h-24 resize-none border-2 border-stone-300/50 placeholder:text-gray-400 outline-none focus:border-blue-400/50 focus:ring-0 focus:ring-blue-200 focus:shadow-md focus:shadow-blue-300/50 rounded-md px-1 py-1"
                  />
                </div>
              </div>
            )}
            {/* <div className="flex flex-col border-2 border-stone-300/50 w-full mt-8 rounded-lg shadow-sm shadow-blue-600/50" /> */}
          </div>
        )}
      </QRCode>
      {/* <QRCodeButton className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2"> */}
      {/* <button
          onClick={onClose}
          className="w-1/2 text-sm bg-blue-700 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Confirmar
        </button> */}

      {/* {currentSpool?.status_sigle === "RE" && (
          <Button
            type="button"
            title="Incia processo produção"
            disabled={currentSpool?.status_sigle !== "RE" || !spool}
            onClick={() => {}}
            className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                  w-1/2 text-sm px-3 py-1 rounded-md h-16
                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
          >
            <PlayIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Iniciar</span>
          </Button>
        )}
        {currentSpool?.status_sigle === "EX" && (
          <Button
            type="button"
            title="Pausar processo produção"
            disabled={currentSpool?.status_sigle !== "EX" || !spool}
            onClick={() => {}}
            className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-500 text-orange-100  hover:bg-orange-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
          >
            <PauseIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Pausar</span>
          </Button>
        )}
        {currentSpool?.status_sigle === "PU" && (
          <Button
            type="button"
            title="Continuar processo produção"
            disabled={currentSpool?.status_sigle !== "PU" || !spool}
            onClick={() => {}}
            className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-400 text-orange-100  hover:bg-orange-600 hover:text-blue-100 hover:shadow-orange-700 hover:shadow-md"
          >
            <StepForwardIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Continuar</span>
          </Button>
        )}
        {currentSpool?.status_sigle === "EX" && (
          <Button
            type="button"
            title="Finaliza processo produção"
            disabled={currentSpool?.status_sigle !== "EX" || !spool}
            onClick={() => {}}
            className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-green-100 hover:shadow-green-600 hover:shadow-md"
          >
            <CheckCircleIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Finalizar</span>
          </Button>
        )}
        {currentSpool?.status_sigle === "FI" && (
          <Button
            type="button"
            title="Avaliar qualidade produto"
            disabled={currentSpool?.status_sigle !== "FI" || !spool}
            onClick={() => {}}
            className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
          >
            <RefreshCcwDotIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Aprova CQ</span>
          </Button>
        )}
        {currentSpool?.status_sigle === "RV" && (
          <Button
            type="button"
            title="Avaliar qualidade produto"
            disabled={currentSpool?.status_sigle !== "RV" || !spool}
            onClick={() => {}}
            className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-lime-500 text-lime-100  hover:bg-lime-800 hover:text-lime-100 hover:shadow-lime-600 hover:shadow-md"
          >
            <PackageOpenIcon className="size-4" />
            <span className="text-sm sm:text-base truncate">Reservar</span>
          </Button>
        )} */}
      {/* 
        <Button
          type="button"
          title="Fechar e cancelar a leitura QRCode"
          onClick={onClose}
          className={`${currentSpool ? "w-1/2" : "w-full"} text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16 text-center flex flex-row gap-1 justify-center items-center`}
        >
          <XCircleIcon className="size-4" />
          Fechar
        </Button> */}
      {/* </QRCodeButton> */}
    </QRCodePanel>
  );
}
