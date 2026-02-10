import { InfoIcon } from "lucide-react";

import { AlertPanel } from "../base/panel";
import { AlertHeader } from "../base/header";
import AlertBody from "../base/body";
import AlertFooter from "../base/footer";

export default function AlertInfo({
  openAlert,
  setOpenAlert,
  setScannerLocked = false,
  message,
}) {
  return (
    <AlertPanel openAlert={openAlert}>
      <AlertHeader title={"Informação"} setOpenAlert={setOpenAlert}>
        <InfoIcon size={64} className="text-blue-950/50 animate-pulse" />
      </AlertHeader>
      <AlertBody message={message}></AlertBody>

      <AlertFooter>
        <div className="flex flex-col w-full h-full py-4 ">
          <button
            onClick={() => (setOpenAlert(false), setScannerLocked(false))}
            className="w-full text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
          >
            Fechar
          </button>
        </div>
      </AlertFooter>
    </AlertPanel>
  );
}
