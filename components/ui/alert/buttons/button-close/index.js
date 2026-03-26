import { XCircleIcon } from "lucide-react";
import Button from "components/ui/button";

export default function ButtonAlertClose({ actionClose }) {
  return (
    <div className=" w-full h-full flex flex-row gap-4 py-4">
      <Button
        onClick={(e) => actionClose(e)}
        className="w-full flex flex-row justify-center items-center gap-2 text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
      >
        <XCircleIcon className="size-4" />
        Fechar
      </Button>
    </div>
  );
}
