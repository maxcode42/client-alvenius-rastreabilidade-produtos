import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";

import Input from "components/ui/input";
import AlertInfo from "components/ui/alert/info";

export default function QRCodeFlow({ isOpen, onClose, spool, setSpool, text }) {
  const qrRegionId = "qr-reader";
  const qrCodeRef = useRef(null);

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const [scannerLocked, setScannerLocked] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

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

  const handleQrDecoded = useCallback(
    (decodedText) => {
      if (scannerLocked) return;

      setResult(decodedText);
      setScannerLocked(true);

      if (!spool) {
        const parsedSpool = parseQrSpoolToJson(decodedText);
        if (parsedSpool) {
          setMessage(`Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`);
          setOpenAlert(true);
          setSpool(parsedSpool);
        }
        return;
      }
    },
    [scannerLocked, parseQrSpoolToJson, setSpool, spool],
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
        fps: 20,
        aspectRatio: 1,
        qrbox: (w, h) => {
          const size = Math.min(w, h) * 0.8;
          return { width: size, height: size };
        },
      },
      (decodedText) => {
        handleQrDecoded(decodedText);
        stopScanner();
      },
    );
  };

  useEffect(() => {
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
    isOpen,
    scannerLocked,
    hasAskedPermission,
    permissionDenied,
    //startScanner,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 pb-16 sm:pb-0 ">
      {/* Header */}
      <div className="w-full max-w-md flex justify-center items-center p-4 text-white">
        <h2 className="text-lg font-semibold">Leitor de QRCode</h2>
      </div>

      <div className="flex flex-col border-2 border-stone-300/50 w-full" />
      {/* Camera */}
      <div className="bg-white rounded-md p-2 py-4 mt-4 w-full max-w-md aspect-square relative">
        {/* <div id={qrRegionId} className="w-[300px] h-[240px]" /> */}

        <div id={qrRegionId} className="w-full h-full" />
      </div>

      {/* Resultado */}
      <div className="mt-4 bg-white w-full max-w-md p-4 rounded-md">
        <div className="flex flex-col py-2">
          <p className="text-sm font-semibold text-center">
            Ler o QRCode do Spool.
          </p>
          <p className="text-sm font-semibold text-center">
            <strong className="text-md font-bold uppercase">{text}</strong>{" "}
            processo produto.
          </p>
        </div>
        <div className="flex flex-col border-2 border-stone-300/50 w-full" />
        {spool && (
          <div className="flex flex-col py-5">
            <p className="mt-2 text-md break-all ">Spool:</p>
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
            </div>
            {String(text).toLowerCase() !== "iniciar" && (
              <div className="flex flex-col py-2">
                <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-16 mr-16 mt-4 mb-4" />
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
                  <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-16 mr-16 mt-8" />
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
                      id="reversivel"
                      name="reversivel"
                      type="radio"
                      value={""}
                      label="Sim"
                      onChange={() => {}}
                      className="w-1/2 flex flex-row"
                    ></Input>
                    <Input
                      id="reversivel"
                      name="reversivel"
                      type="radio"
                      value={""}
                      label="Não"
                      onChange={() => {}}
                    ></Input>
                  </div>
                  <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-16 mr-16 mt-8" />
                </div>
                <Input
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
                </Input>
              </div>
            )}
            <div className="flex flex-col border-2 border-stone-300/50 w-full mt-8" />
          </div>
        )}
        <div className="flex flex-col py-4">
          <p className="text-sm font-semibold">Último QRCode lido:</p>
          <p className="mt-2 text-xs break-all text-gray-700">
            {result ?? (
              <span className="animate-pulse">Aguardando leitura...</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2">
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
      </div>

      {/* Alert */}
      <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={setScannerLocked}
      />
    </div>
  );
}
