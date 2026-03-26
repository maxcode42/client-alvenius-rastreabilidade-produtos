import { XCircleIcon } from "lucide-react";

import Button from "components/ui/button";
import ButtonFlow from "components/ui/button-flow";

import { useQRCode } from "hooks/qr-code-context";

import { QRCODE_TYPES } from "types/qr-code-reading";

export default function QRCodeButton({ children, ...props }) {
  const {
    currentSpool,
    onClose,
    setNewStatus,
    setScannerLocked,
    qrCodeReadingType,
  } = useQRCode();

  async function execute(e, item, status) {
    await setScannerLocked(true);
    await setNewStatus(status);
    await onClose();
  }

  return (
    <section className="w-full max-w-md h-full flex flex-row  py-8 gap-4 sm:w-1/2">
      {children}

      <ButtonFlow
        //item={null}
        item={currentSpool}
        action={execute}
        className={props.className}
        displayButtonsOnCard={false}
        statusAcronym={currentSpool?.status_acronym}
      />
      <Button
        type="button"
        title="Fechar e cancelar a leitura QRCode"
        onClick={() => {
          // onClose(), setScannerLocked(true), setSpool(null);
          onClose(), setScannerLocked(true);
        }}
        className={`${currentSpool && qrCodeReadingType.includes(QRCODE_TYPES.spool) ? "w-1/2" : "w-full"} h-16 gap-1 flex flex-row px-3 py-1 truncate 
        text-sm text-center items-center justify-center rounded-md bg-red-600 text-red-100 
        hover:bg-red-800 hover:text-red-100 hover:shadow-red-500`}
      >
        <XCircleIcon className="size-4" />
        Fechar
      </Button>
    </section>
  );
}
