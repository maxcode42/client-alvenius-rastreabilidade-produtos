import Button from "components/ui/button";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

export default function ButtonAlertForm({ action, actionClose }) {
  return (
    <div className=" w-full h-full flex flex-row gap-4 py-4">
      <Button
        onClick={(e) => action(e)}
        className="w-full flex flex-row justify-center items-center gap-2 text-sm bg-blue-600 px-3 py-1 rounded-md text-stone-100 h-16"
      >
        <CheckCircle2Icon className="size-4" />
        Confirmar
      </Button>
      <Button
        onClick={(e) => actionClose(e)}
        className="w-full flex flex-row justify-center items-center gap-2 text-sm bg-amber-600 px-3 py-1 rounded-md text-stone-100 h-16"
      >
        <XCircleIcon className="size-4" />
        Cancela
      </Button>
    </div>
  );
}
