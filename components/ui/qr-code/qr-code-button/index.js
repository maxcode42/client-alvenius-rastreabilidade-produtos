import Button from "components/ui/button";

import {
  CheckCircleIcon,
  PackageOpenIcon,
  PauseIcon,
  PlayIcon,
  RefreshCcwDotIcon,
  StepForwardIcon,
  XCircleIcon,
} from "lucide-react";

export default function QRCodeButton({
  currentSpool,
  onClose,
  spool,
  action,
  children,
}) {
  return (
    <section className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2">
      {children}
      {currentSpool?.status_sigle === "RE" && (
        <Button
          type="button"
          title="Incia processo produção"
          disabled={currentSpool?.status_sigle !== "RE" || !spool}
          onClick={action}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                  w-1/2 text-sm px-3 py-1 rounded-md h-16
                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
        >
          <PlayIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Iniciar</span>
        </Button>
      )}
      {currentSpool?.status_sigle === "EX" && (
        <Button
          type="button"
          title="Pausar processo produção"
          disabled={currentSpool?.status_sigle !== "EX" || !spool}
          onClick={action}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-500 text-orange-100  hover:bg-orange-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
        >
          <PauseIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Pausar</span>
        </Button>
      )}
      {currentSpool?.status_sigle === "PU" && (
        <Button
          type="button"
          title="Continuar processo produção"
          disabled={currentSpool?.status_sigle !== "PU" || !spool}
          onClick={action}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-400 text-orange-100  hover:bg-orange-600 hover:text-blue-100 hover:shadow-orange-700 hover:shadow-md"
        >
          <StepForwardIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Continuar</span>
        </Button>
      )}
      {currentSpool?.status_sigle === "EX" && (
        <Button
          type="button"
          title="Finaliza processo produção"
          disabled={currentSpool?.status_sigle !== "EX" || !spool}
          onClick={action}
          className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-green-100 hover:shadow-green-600 hover:shadow-md"
        >
          <CheckCircleIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Finalizar</span>
        </Button>
      )}
      {currentSpool?.status_sigle === "FI" && (
        <Button
          type="button"
          title="Avaliar qualidade produto"
          disabled={currentSpool?.status_sigle !== "FI" || !spool}
          onClick={action}
          className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
        >
          <RefreshCcwDotIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Aprova CQ</span>
        </Button>
      )}
      {currentSpool?.status_sigle === "RV" && (
        <Button
          type="button"
          title="Avaliar qualidade produto"
          disabled={currentSpool?.status_sigle !== "RV" || !spool}
          onClick={action}
          className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-lime-500 text-lime-100  hover:bg-lime-800 hover:text-lime-100 hover:shadow-lime-600 hover:shadow-md"
        >
          <PackageOpenIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Reservar</span>
        </Button>
      )}
      <Button
        type="button"
        title="Fechar e cancelar a leitura QRCode"
        onClick={onClose}
        className={`${currentSpool ? "w-1/2" : "w-full"} text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16 text-center flex flex-row gap-1 justify-center items-center`}
      >
        <XCircleIcon className="size-4" />
        Fechar
      </Button>
    </section>
  );
}
