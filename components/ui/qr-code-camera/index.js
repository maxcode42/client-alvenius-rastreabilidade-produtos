import { useCallback, useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeCamera({
  setScannerLocked,
  scannerLocked,
  setOpenAlert,
  setMessage,
  setResult,
  setSpool,
}) {
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const qrRegionId = "qr-reader";
  const qrCodeRef = useRef(null);

  const handleQrDecoded = useCallback(
    (decodedText) => {
      if (scannerLocked) return;

      setResult(decodedText);
      setScannerLocked(true);
      setSpool(null);
    },
    [scannerLocked, setResult, setScannerLocked, setSpool],
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
    //isOpen,
    scannerLocked,
    hasAskedPermission,
    permissionDenied,
    //startScanner,
  ]);
  return (
    <div className="bg-white rounded-md p-2 py-4 mt-4 w-full max-w-md aspect-square relative">
      {/* Camera */}
      {/* <div id={qrRegionId} className="w-[300px] h-[240px]" /> */}

      <div id={qrRegionId} className="w-full h-full" />

      {/* Cantos  */}
      <div className="absolute rounded-tl-md top-28 left-24 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
      <div className="absolute rounded-tr-md top-28 right-24 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
      <div className="absolute rounded-bl-md bottom-28 left-24 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
      <div className="absolute rounded-br-md bottom-28 right-24 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>

      {/* Linha animada */}
      <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
    </div>
  );
}
