import { useCallback, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeCamera() {
  const { openQRCode, openAlert, setOpenAlert, setResult, setSpool } =
    useQRCode();

  const qrRegionId = "qr-reader";

  const qrCodeRef = useRef(null);
  const isStartingRef = useRef(false);
  const lastReadRef = useRef(null);
  const scanLockRef = useRef(false);

  /* =========================
     STOP CAMERA
     ========================= */
  const stopScanner = useCallback(async () => {
    const instance = qrCodeRef.current;
    if (!instance) return;

    qrCodeRef.current = null;
    scanLockRef.current = false;
    lastReadRef.current = null;

    try {
      await instance.stop();
      await instance.clear();
    } catch (error) {
      console.error("[QR-CODE] Erro ao parar scanner:", {
        error,
        message: error?.message ?? "Erro desconhecido",
      });
    }
  }, []);

  /* =========================
     PAUSE SCANNER
     ========================= */
  const pauseScanner = useCallback(() => {
    const instance = qrCodeRef.current;
    if (!instance) return;

    try {
      instance.pause(true);
    } catch (error) {
      console.error("[QR-CODE] Erro ao pausar scanner:", {
        error,
        message: error?.message ?? "Erro desconhecido",
      });
    }
  }, []);

  /* =========================
     RESUME SCANNER
     ========================= */
  const resumeScanner = useCallback(() => {
    const instance = qrCodeRef.current;
    if (!instance) return;

    try {
      scanLockRef.current = false;
      lastReadRef.current = null;

      instance.resume();
    } catch (error) {
      console.error("[QR-CODE] Erro ao retomar scanner:", {
        error,
        message: error?.message ?? "Erro desconhecido",
      });
    }
  }, []);

  /* =========================
     START SCANNER
     ========================= */
  const startScanner = useCallback(async () => {
    if (qrCodeRef.current || isStartingRef.current) return;

    isStartingRef.current = true;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          aspectRatio: 1,
        },
        (decodedText) => {
          if (scanLockRef.current) return;
          if (lastReadRef.current === decodedText) return;

          scanLockRef.current = true;
          lastReadRef.current = decodedText;

          pauseScanner();

          /* limpa resultado antes da nova leitura */
          setResult(null);
          setSpool(null);

          /* garante novo ciclo de render */
          setTimeout(() => {
            try {
              setResult(decodedText);
              //setOpenAlert(true);
            } catch (error) {
              console.error("[QR-CODE] Erro ao processar leitura:", {
                error,
                decodedText,
                message: error?.message ?? "Erro desconhecido",
              });
            }
          }, 0);
        },
      );
    } catch (error) {
      console.error("[QR-CODE] Erro ao iniciar scanner:", {
        error,
        message: error?.message ?? "Erro desconhecido",
      });

      qrCodeRef.current = null;
    } finally {
      isStartingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseScanner, setOpenAlert, setResult]);

  /* =========================
     ALERT CONTROL
     ========================= */
  useEffect(() => {
    if (!openAlert) {
      resumeScanner();
    }
  }, [openAlert, resumeScanner]);

  /* =========================
     MODAL CONTROL
     ========================= */
  useEffect(() => {
    if (!openQRCode) {
      stopScanner();
      return;
    }

    startScanner();

    return () => {
      stopScanner();
    };
  }, [openQRCode, startScanner, stopScanner]);

  return (
    <div className="bg-white rounded-md p-2 py-4 mt-4 w-full max-w-md aspect-square relative">
      <div id={qrRegionId} className="w-full h-full" />

      {/* Cantos */}
      <div className="absolute rounded-tl-md top-28 left-24 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
      <div className="absolute rounded-tr-md top-28 right-24 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
      <div className="absolute rounded-bl-md bottom-28 left-24 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
      <div className="absolute rounded-br-md bottom-28 right-24 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>

      {/* Linha scan */}
      <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
    </div>
  );
}
