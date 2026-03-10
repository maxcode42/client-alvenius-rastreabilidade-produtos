import * as Icons from "lucide-react";
import { XCircleIcon } from "lucide-react";

import Button from "components/ui/button";

import { useQRCode } from "hooks/qr-code-context";
import { PROCESS_STATUS } from "types/process-status";

import { twMerge } from "tailwind-merge";

export default function QRCodeButton({ children }) {
  const {
    currentSpool,
    onClose,
    spool,
    data,
    //action,
    setSpool,
    setNewStatus,
    setScannerLocked,
  } = useQRCode();
  const textAreaCharactersMin = 15;

  async function execute(status) {
    await setScannerLocked(true);
    await setNewStatus(status);
    //await action?.handlerData();
    await onClose();
  }
  // const currentSpoolAlt = !currentSpool ? {} : currentSpool;
  // if (currentSpool) {
  //   currentSpoolAlt.status_acronym = "FI";
  // }

  // const buttonsDisplay = Object.keys(PROCESS_STATUS.acronym).reduce(
  //   (acc, status) => {
  //     let status_acronym = PROCESS_STATUS.acronym_next[status];
  //     console.log(currentSpoolAlt.status_acronym, status_acronym);
  //     // if (
  //     //   currentSpoolAlt?.status_acronym === PROCESS_STATUS.acronym.executando &&
  //     //   status_acronym !== PROCESS_STATUS.acronym_next.finalizado &&
  //     //   status_acronym !== PROCESS_STATUS.acronym_next.pausado //||
  //     //   // (currentSpoolAlt?.status_acronym !==
  //     //   //   PROCESS_STATUS.acronym.acronym_next &&
  //     //   //   currentSpoolAlt?.status_acronym !== status_acronym)
  //     // ) {
  //     //   return acc;
  //     // }
  //     // if (!PROCESS_STATUS.acronym_next[status].includes(status)) return acc;
  //     // acc.push({
  //     //   // sigla: currentSpool?.status_acronym.concat("_", status_acronym),
  //     //   sigla: status_acronym[0],
  //     // });

  //     return acc;
  //   },
  //   [],
  // );

  const buttonsDisplay =
    PROCESS_STATUS?.acronym_next[currentSpool?.status_acronym];

  const buttonAttribute = {
    EX: {
      name: "Iniciar",
      title: "Incia processo produção",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.reservado !== currentSpool?.status_acronym,
      process_next: PROCESS_STATUS.acronym.executando,
      class_name: `disabled:bg-amber-500/50 disabled:text-amber-100/50 bg-amber-500 
                  text-amber-100 hover:bg-amber-800 hover:text-amber-100 hover:shadow-amber-600`,
      icon: "PlayIcon",
    },
    PU: {
      name: "Pausar",
      title: "Pausar processo produção",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym,
      process_next: PROCESS_STATUS.acronym.pausado,
      class_name: `
                  disabled:bg-orange-500/50 disabled:text-orange-100/50 bg-orange-500 
                  text-orange-100 hover:bg-orange-800 hover:text-orange-100 hover:shadow-orange-400`,
      icon: "PauseIcon",
    },
    CO: {
      name: "Continuar",
      title: "Continuar processo produção",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.pausado !== currentSpool?.status_acronym,
      process_next: PROCESS_STATUS.acronym.continua,
      class_name: `
                  disabled:bg-orange-500/50 disabled:text-orange-100/50 bg-orange-500 
                  text-orange-100 hover:bg-orange-800 hover:text-orange-100 hover:shadow-orange-600`,
      icon: "StepForwardIcon",
    },
    FI: {
      name: "Finalizar",
      title: "Finaliza processo produção",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym,
      process_next: PROCESS_STATUS.acronym.finalizado,
      class_name: `
                  disabled:bg-green-500/50 disabled:text-green-100/50 bg-green-600 
                  text-green-100 hover:bg-green-800 hover:text-green-100 hover:shadow-green-500`,
      icon: "CheckCircleIcon",
    },
    RO: {
      name: "Aprova CQ",
      title: "Avaliar qualidade produto",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.finalizado !== currentSpool?.status_acronym ||
        data?.qualityText?.length < textAreaCharactersMin,
      process_next: PROCESS_STATUS.acronym.romaneio,
      class_name: `
                  disabled:bg-sky-500/50 disabled:text-sky-100/50 bg-sky-600 
                  text-sky-100 hover:bg-sky-800 hover:text-sky-100 hover:shadow-sky-500
                  ${data?.accordance && !data?.reversible ? "" : "hidden"}
                  `,
      icon: "CheckCheckIcon",
    },
    RV: {
      name: "Reverter",
      title: "Retornar inicio do processo",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.finalizado !== currentSpool?.status_acronym ||
        data?.qualityText?.length < textAreaCharactersMin,
      process_next: PROCESS_STATUS.acronym.reverte,
      class_name: `
                  disabled:bg-lime-500/50 disabled:text-lime-100/50 bg-lime-500 
                  text-lime-100 hover:bg-lime-800 hover:text-lime-100 hover:shadow-lime-600
                  ${!data?.accordance && data?.reversible ? "" : "hidden"}
                  `,
      icon: "Repeat2Icon",
    },
    SU: {
      name: "Sucata",
      title: "Descarte do produto",
      disabled:
        !spool ||
        PROCESS_STATUS.acronym.finalizado !== currentSpool?.status_acronym ||
        data?.qualityText?.length < textAreaCharactersMin,
      process_next: PROCESS_STATUS.acronym.sucata,
      class_name: `
                  disabled:bg-red-500/50 disabled:text-red-100/50 bg-red-500 
                  text-red-100 hover:bg-red-800 hover:text-red-100 hover:shadow-red-600
                  ${!data?.accordance && !data?.reversible ? "" : "hidden"}
                  `,
      icon: "RefreshCwOffIcon", //"PackageXIcon", //"TriangleAlertIcon",
    },
  };

  return (
    <section className="w-full max-w-md h-full flex flex-row  py-8 gap-4 sm:w-1/2">
      {children}

      {buttonsDisplay?.map((acronym) => {
        const attribute = buttonAttribute[acronym];
        const Icon = Icons[attribute?.icon];
        return (
          <Button
            type="button"
            key={attribute?.name}
            title={attribute?.title}
            disabled={attribute?.disabled}
            onClick={() => execute(attribute?.process_next)}
            //onClick={action}
            className={twMerge(
              `w-1/2 min-w-20 h-16 gap-1 flex flex-row px-3 py-1 
            truncate text-sm text-center items-center justify-center rounded-md 
            disable:cursor-not-allowed disabled:shadow-none hover:shadow-md`,
              attribute?.class_name,
            )}
          >
            {Icon && <Icon className="size-4" />}

            <span className="text-sm sm:text-base truncate">
              {attribute?.name}
            </span>
          </Button>
        );
      })}
      <Button
        type="button"
        title="Fechar e cancelar a leitura QRCode"
        onClick={() => {
          onClose(), setScannerLocked(true), setSpool(null);
        }}
        className={`${currentSpool ? "w-1/2" : "w-full"} h-16 gap-1 flex flex-row px-3 py-1 truncate 
        text-sm text-center items-center justify-center rounded-md bg-red-600 text-red-100 
        hover:bg-red-800 hover:text-red-100 hover:shadow-red-500`}
      >
        <XCircleIcon className="size-4" />
        Fechar
      </Button>
    </section>
  );
}
