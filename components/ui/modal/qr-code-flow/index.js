import { Html5Qrcode } from "html5-qrcode";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";

import Input from "components/ui/input";
import QRCode from "components/ui/qr-code";
import TextSpool from "components/ui/text-spool";

import { useQRCode } from "hooks/qr-code-context";

// import AlertInfo from "components/ui/alert/info";

export default function QRCodeFlow({
  //   currentSpool = null,
  //   setSpool,
  //   onClose,
  //   isOpen,
  //   action,
  //   spool,
  text,
}) {
  // const [message, setMessage] = useState("");
  // const [result, setResult] = useState(null);
  // const [openAlert, setOpenAlert] = useState(false);
  // const [scannerLocked, setScannerLocked] = useState(false);

  const {
    action,
    setOpenAlert,
    setMessage,
    setSpool,
    result,
    spool,
    currentSpool,
    openQRCode,
    setResult,
    scannerLocked,
    setScannerLocked,
    //isOpen,
  } = useQRCode();

  const qrRegionId = "qr-reader";
  const qrCodeRef = useRef(null);

  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const [accordance, setAccordance] = useState(false);
  const [reversible, setReversible] = useState(false);
  const [qualityText, setQualityText] = useState("");
  const [isMaxHeightText, setIsMaxHeightText] = useState(false);
  const maxTextArea = useMemo(() => {
    return {
      characters: 180,
      lines: 3,
    };
  }, []);

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
    const regex = /^(SP(?:-[A-Za-z0-9]+)+)\s+([\s\S]*)$/;
    const normalized = normalizedText(text);
    const match = normalized.match(regex);
    // const match = normalized
    //   .trim()
    //   .match(/^(SP-[A-Za-z0-9]{4}-[A-Za-z0-9]{5}-[A-Za-z0-9]{3})\s+(.*)$/);
    if (!match) {
      setMessage(
        "QRCODE-FLOW: Escanear um QRCode do SPOOL, ou este QRCODE é inválido!",
      );
      setOpenAlert(true);
      return null;
    }
    return { codigo: match[1], descricao: match[2] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQrDecoded = useCallback(
    (decodedText) => {
      if (scannerLocked) return;

      setResult(decodedText);
      setScannerLocked(true);

      if (!spool) {
        const parsedSpool = parseQrSpoolToJson(decodedText);
        if (parsedSpool) {
          setMessage(
            `QRCODE-FLOW Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`,
          );
          setOpenAlert(true);
          setSpool(parsedSpool);

          //action(parsedSpool.codigo);
        }

        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scannerLocked, parseQrSpoolToJson, setSpool, spool, action],
  );

  const stopScanner = async () => {
    if (!qrCodeRef.current) return;

    try {
      await qrCodeRef.current.stop();
      await qrCodeRef.current.clear();
    } catch (error) {
      console.error(error);
    }
    qrCodeRef.current = null;
  };

  const checkCameraSupport = () => {
    return !!navigator.mediaDevices?.getUserMedia;
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissionDenied(false);
      return true;
    } catch (error) {
      if (error.name === "NotAllowedError") {
        setPermissionDenied(true);
      }
      return false;
    }
  };

  const startScanner = async () => {
    if (qrCodeRef.current) return;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeRef.current = html5QrCode;

    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 15,
        aspectRatio: 1,
        disableFlip: false,
        // qrbox: (w, h) => {
        //   const base = Math.min(w, h);
        //   const size = Math.min(Math.max(base * 0.8, 50), 400);

        //   return {
        //     width: size,
        //     height: size,
        //   };
        // },
      },
      (decodedText) => {
        handleQrDecoded(decodedText);
        stopScanner();
      },
    );
  };

  const handleQrDecodedCustom = useCallback(async () => {
    if ((!spool && !result) || spool !== null) {
      return;
    }

    const parsedSpool = parseQrSpoolToJson(result);
    if (parsedSpool) {
      setMessage(
        `QRCODE-FLOW Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`,
      );
      setSpool(parsedSpool);
      setOpenAlert(true);

      //await action(parsedSpool.codigo);
      //await checkIfCodeExists(parsedSpool.codigo);
    }
  }, [parseQrSpoolToJson, setSpool, spool, result]);

  // async function handlerData() {
  //   await action(
  //     {
  //       data: {
  //         accordance,
  //         reversible,
  //         qualityText,
  //       },
  //     },
  //     currentSpool,
  //   );
  // }

  useEffect(() => {
    //if (isOpen) return;
    if (openQRCode) return;
    if (scannerLocked) return;

    let isMounted = true;

    const initCamera = async () => {
      // Verifica suporte
      if (!checkCameraSupport()) {
        setMessage("Câmera não suportada neste dispositivo.");
        setOpenAlert(true);
        return;
      }

      // Se já negou antes → mostra alerta direto
      if (permissionDenied) {
        setMessage(
          "Permissão de câmera negada. Ative nas configurações do navegador.",
        );
        setOpenAlert(true);
        return;
      }

      // Primeira vez → solicitar permissão sem alertar antes
      if (!hasAskedPermission) {
        setHasAskedPermission(true);

        const granted = await requestCameraPermission();

        if (!granted) {
          // usuário negou agora → não mostrar alerta neste primeiro ciclo
          return;
        }
      }

      // Se permissão concedida → inicia scanner
      if (isMounted) {
        await startScanner();
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      //setScannerLocked(false);
      //stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    //isOpen,
    openQRCode,
    scannerLocked,
    hasAskedPermission,
    permissionDenied,
    //startScanner,
  ]);

  useEffect(() => {}, [isMaxHeightText]);

  useEffect(() => {
    handleQrDecodedCustom();
  }, [handleQrDecodedCustom]);

  useEffect(() => {}, [isMaxHeightText]);

  // if (!isOpen) return null;
  if (!openQRCode) return null;

  return (
    <Fragment>
      {/* <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 pb-16 sm:pb-0 "> */}
      {/* Camera */}
      <QRCode
      // setScannerLocked={setScannerLocked}
      // scannerLocked={scannerLocked}
      // setOpenAlert={setOpenAlert}
      // setMessage={setMessage}
      // setResult={setResult}
      // setSpool={setSpool}
      // result={result}
      // message={message}
      // openAlert={openAlert}
      // spool={spool}
      // currentSpool={currentSpool}
      // onClose={onClose}
      // action={handlerData}
      >
        {/* Resultado */}
        {/* <div className="mt-4 bg-white w-full max-w-md p-4 rounded-md"> */}
        <div className="flex flex-col py-2">
          <p className="text-sm font-semibold text-center">
            Ler o QRCode do Spool - FLOW.
          </p>
          <p className="text-sm font-semibold text-center">
            <strong className="text-md font-bold uppercase">{text}</strong>{" "}
            processo produto.
          </p>
        </div>
        <div className="flex flex-col border-2 border-stone-300/50 w-full rounded-full" />
        {spool && (
          <div className="flex flex-col py-5">
            {/* <p className="mt-2 text-md break-all ">Spool:</p>
            <div className="text-xs sm:text-lg">
              <div className="flex flex-col ">
                <p>
                  <span className="font-semibold">Código: </span>
                  <span className="font-normal">{spool?.codigo}</span>
                </p>
                <p className="text-xs max-w-xs break-words line-clamp-2">
                  <span className="font-semibold">Descrição: </span>
                  <span className="font-normal">{spool?.descricao}</span>
                </p>
              </div>
            </div> */}
            <TextSpool spool={spool} />

            {String(currentSpool?.status_sigle).toUpperCase() === "FI" && (
              <div className="flex flex-col py-2">
                <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-4 mb-4 rounded-full" />
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
                  <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" />
                </div>
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
                  <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" />
                </div>
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
            <div className="flex flex-col border-2 border-stone-300/50 w-full mt-8" />
          </div>
        )}
      </QRCode>
      {/* <div className="flex flex-col py-4">
          <p className="text-sm font-semibold">Último QRCode lido:</p>
          <p className="mt-2 text-xs break-all text-gray-700 w-full flex flex-row justify-center item-center">
            {result ?? (
              <span className="animate-pulse mt-2 px-4 py-2 rounded-md w-fit">
                Aguardando leitura...
              </span>
            )}
          </p>
        </div> */}
      {/* </div> */}
      {/* <div className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2">
        <button
          onClick={onClose}
          className="w-1/2 text-sm bg-blue-700 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Confirmar
        </button>
        <button
          onClick={onClose}
          className="w-1/2 text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Fechar
        </button>
      </div> */}

      {/* Alert */}
      {/* <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={setScannerLocked}
      /> */}
      {/* </div> */}
    </Fragment>
  );
}
