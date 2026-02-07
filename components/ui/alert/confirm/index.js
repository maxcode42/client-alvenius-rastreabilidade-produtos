import { CircleQuestionMarkIcon } from "lucide-react";
import { AlertHeader } from "../base/header";
import AlertFooter from "../base/footer";
import { AlertPanel } from "../base/panel";
import AlertBody from "../base/body";

export default function AlertConfirm({
  openAlert,
  setOpenAlert,
  message,
  action,
}) {
  function handleConfirm(e) {
    e.preventDefault();
    action();
    setOpenAlert(false);
  }
  return (
    <AlertPanel openAlert={openAlert}>
      <AlertHeader title={"Questão"} setOpenAlert={setOpenAlert}>
        <CircleQuestionMarkIcon
          size={64}
          className="text-red-600/50 animate-pulse"
        />
      </AlertHeader>
      <AlertBody message={message}></AlertBody>
      <AlertFooter>
        <div className="flex flex-row gap-4 w-full h-full py-4 ">
          <button
            onClick={() => setOpenAlert(false)}
            className="w-full text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
          >
            Cancela
          </button>
          <button
            onClick={(e) => handleConfirm(e)}
            className="w-full text-sm bg-blue-600 px-3 py-1 rounded-md text-stone-100 h-16"
          >
            Confirmar
          </button>
        </div>
      </AlertFooter>
    </AlertPanel>
  );
}
