import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";

import Input from "components/ui/input";
import QRCode from "components/ui/qr-code";
import TextSpool from "components/ui/text-spool";
import Separator from "components/ui/separator";

import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeFlowCustom() {
  const {
    action,
    setOpenAlert,
    setMessage,
    setSpool,
    result,
    spool,
    currentSpool,
    openQRCode,
    data,
    setData,
  } = useQRCode();

  const [isMaxHeightText, setIsMaxHeightText] = useState(false);
  const maxTextArea = useMemo(() => {
    return {
      characters: 120,
      lines: 3,
    };
  }, []);

  function getStatusText(acronym) {
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

    const ex = statusText[acronym || "default"];

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

    setData({ ...data, qualityText: textarea.value });
    setIsMaxHeightText(false);
  }

  function normalizedText(text) {
    return new TextDecoder("utf-8")
      .decode(new TextEncoder().encode(text))
      .normalize("NFC");
  }

  const parseQrSpoolToJson = useCallback((text) => {
    const regex = /^(SP(?:-[A-Za-z0-9]+)+)\s+([\s\S]*)$/;
    const normalized = normalizedText(text);
    const match = normalized.match(regex);
    // const match = normalized
    //   .trim()
    //   .match(/^(SP-[A-Za-z0-9]{4}-[A-Za-z0-9]{5}-[A-Za-z0-9]{3})\s+(.*)$/);
    if (!match) {
      setMessage(
        "QRCODE-FLOW-CUSTOM: Escanear um QRCode do SPOOL, ou este QRCODE é inválido!",
      );
      setOpenAlert(true);
      return null;
    }
    return { codigo: match[1], descricao: match[2] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfCodeExists = useCallback(
    async (code) => {
      if (!currentSpool) {
        await action(code);

        return;
      }

      if (currentSpool?.codigo !== code) {
        setMessage(
          `QRCODE-FLOW-CUSTOM: O código escaneado é diferente, escanei o QRCode do SPOOL código: ${currentSpool?.codigo}`,
        );
        setOpenAlert(true);
      }
    },
    [action, currentSpool, setOpenAlert, setMessage],
  );

  // function onChangeReversible(value) {}

  // function onChangeAccordance(value) {
  //   setAccordance(!accordance);
  // }

  const handleQrDecoded = useCallback(async () => {
    if ((!spool && !result) || spool !== null) {
      return;
    }

    const parsedSpool = parseQrSpoolToJson(result);
    if (parsedSpool) {
      setMessage(
        `QRCODE-FLOW-CUSTOM Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`,
      );
      setSpool(parsedSpool);
      setOpenAlert(true);

      //await action(parsedSpool.codigo);
      await checkIfCodeExists(parsedSpool.codigo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parseQrSpoolToJson, checkIfCodeExists, setSpool, spool, result]);

  useEffect(() => {}, [isMaxHeightText]);

  useEffect(() => {
    handleQrDecoded();
  }, [handleQrDecoded]);

  if (!openQRCode) return null;

  return (
    <QRCode>
      <div className="flex flex-col py-2">
        <p className="text-sm font-semibold text-center">
          Ler o QRCode do Spool - CUSTOM.
        </p>
        <p className="text-sm font-semibold text-center">
          <strong className="text-md font-bold uppercase">
            {getStatusText(currentSpool?.status_acronym)}
          </strong>{" "}
          processo produto.
        </p>
      </div>
      {/* <div className="flex flex-col border-2 border-stone-300/50 w-full rounded-full" /> */}
      <Separator />
      {spool && (
        <div className="flex flex-col py-5">
          <TextSpool spool={spool} />

          {String(currentSpool?.status_acronym).toUpperCase() === "FI" && (
            <div
              className={`flex flex-col py-2
                  opacity-0
                  translate-y-4
                  animate-fadeInDown
                  [animation-delay:${120}ms]
                  animation-fill-mode:forwards
              `}
            >
              {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-4 mb-4 rounded-full" /> */}
              <Separator className={"via-stone-300/50"} />
              <div
                className={`${data?.reversible ? "text-stone-300/50" : ""} flex flex-col justify-center gap-1 py-4`}
              >
                <label className="w-full flex flex-row item-center gap-1">
                  <CircleQuestionMarkIcon
                    className="text-stone-400 mr-2 mt-0.5"
                    size={18}
                  />
                  Produto está conforme?
                </label>
                <div className="flex flex-row justify-around">
                  <Input
                    label="Sim"
                    type="radio"
                    id="conforme"
                    name="conforme"
                    value={data?.accordance}
                    checked={data?.accordance}
                    disabled={data?.reversible}
                    onChange={() =>
                      setData({ ...data, accordance: !data?.accordance })
                    }
                  />
                  <Input
                    label="Não"
                    type="radio"
                    id="conforme"
                    name="conforme"
                    value={!data?.accordance}
                    checked={!data?.accordance}
                    disabled={data?.reversible}
                    onChange={() =>
                      setData({ ...data, accordance: !data?.accordance })
                    }
                  />
                </div>
                {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" /> */}
              </div>
              <Separator className={"via-stone-300/50"} />
              <div
                className={`${data?.accordance ? "text-stone-300/50" : ""} flex flex-col justify-center gap-1 py-4`}
              >
                <label className="w-full flex flex-row item-center gap-1">
                  <CircleQuestionMarkIcon
                    className="text-stone-400 mr-2 mt-0.5"
                    size={18}
                  />
                  Produto é reversível?
                </label>
                <div className="flex flex-row justify-around">
                  <Input
                    type="radio"
                    id="reversible"
                    name="reversible"
                    value={data?.reversible}
                    checked={data?.reversible}
                    disabled={data?.accordance}
                    label="Sim"
                    onChange={() =>
                      setData({ ...data, reversible: !data?.reversible })
                    }
                  />
                  <Input
                    label="Não"
                    id="reversible"
                    name="reversible"
                    type="radio"
                    value={!data?.reversible}
                    checked={!data?.reversible}
                    disabled={data?.accordance}
                    onChange={() =>
                      setData({ ...data, reversible: !data?.reversible })
                    }
                  />
                </div>
                {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" /> */}
              </div>

              <Separator className={"via-stone-300/50"} />

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
                    * Limite máximo de <strong>{maxTextArea.characters}</strong>{" "}
                    caracteres ou <strong>{maxTextArea.lines}</strong> linhas.
                  </span>
                </p>
                <textarea
                  rows={maxTextArea.lines}
                  value={data?.qualityText}
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
  );
}
