import {
  CheckCircleIcon,
  PackageOpenIcon,
  PauseIcon,
  PlayIcon,
  RefreshCcwDotIcon,
  StepForwardIcon,
  XCircleIcon,
} from "lucide-react";

import Button from "components/ui/button";

import { useQRCode } from "hooks/qr-code-context";
import { PROCESS_STATUS } from "types/process-status";

export default function QRCodeButton_bkp({ children }) {
  const {
    currentSpool,
    onClose,
    spool,
    action,
    setSpool,
    setNewStatus,
    setScannerLocked,
    // setCurrentSpool,
  } = useQRCode();

  // const [currentStatusPaused, setCurrentStatusPaused] = useState(true);

  async function execute(status) {
    await setScannerLocked(true);
    await setNewStatus(status);
    await onClose();
    //Comentado enquanto estiver usando FORM QUALIDADE separado MODAL QRCode
    await action();
  }

  // function buttonConfig(type) {
  //   const params = {
  //     RE: () => {
  //       return {
  //         name: "Iniciar",
  //         title: "Incia processo produção",
  //         disabled:
  //           (!spool ||
  //             PROCESS_STATUS.acronym.reservado !==
  //               currentSpool?.status_acronym) &&
  //           PROCESS_STATUS.acronym.pausado !== currentSpool?.status_acronym &&
  //           PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym,
  //         process_next: PROCESS_STATUS.acronym.executando,
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
  //                 w-1/2 text-sm px-3 py-1 rounded-md h-16
  //                  truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md`,
  //         icon: "teste",
  //       };
  //     },
  //     EX: () => {
  //       if (currentStatusPaused === type) {
  //         setCurrentStatusPaused(!currentStatusPaused);
  //         return {
  //           name: "Pausar",
  //           title: "Pausar processo produção",
  //           disabled:
  //             !spool ||
  //             PROCESS_STATUS.acronym.executando !==
  //               currentSpool?.status_acronym,
  //           process_next: PROCESS_STATUS.acronym.pausado,
  //           class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
  //                  truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-500 text-orange-100  hover:bg-orange-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
  //                 `,
  //           icon: "teste",
  //         };
  //       }
  //       return {
  //         name: "Pausar",
  //         title: "Finaliza processo produção",
  //         disabled:
  //           !spool ||
  //           PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym,
  //         process_next: PROCESS_STATUS.acronym.finalizado,
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
  //              truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-green-100 hover:shadow-green-600 hover:shadow-md"
  //                 `,
  //         icon: "teste",
  //       };
  //     },
  //     PU: () => {
  //       return {
  //         name: "Continuar",
  //         title: "Continuar processo produção",
  //         disabled:
  //           !spool ||
  //           PROCESS_STATUS.acronym.pausado !== currentSpool?.status_acronym,
  //         process_next: PROCESS_STATUS.acronym.continua,
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
  //                 w-1/2 text-sm px-3 py-1 rounded-md h-16
  //                  truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md`,
  //         icon: "teste",
  //       };
  //     },
  //     // CO: () => { return {
  //     //   name: "",
  //     //   title: "",
  //     //   disabled: false,
  //     //   process_next: () => {}},
  //     //   class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
  //     //             w-1/2 text-sm px-3 py-1 rounded-md h-16
  //     //              truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md`,
  //     //   icon: "",
  //     // }},
  //     FI: () => {
  //       return {
  //         name: "Finalizar",
  //         title: "Avaliar qualidade produto",
  //         disabled:
  //           !spool ||
  //           PROCESS_STATUS.acronym.finalizado !== currentSpool?.status_acronym,
  //         process_next: PROCESS_STATUS.acronym.romaneio,
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
  //              truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md`,
  //         icon: "teste",
  //       };
  //     },
  //     RV: () => {
  //       return {
  //         name: "Reservar",
  //         title: "Reverte produto para inici",
  //         disabled:
  //           !spool ||
  //           PROCESS_STATUS.acronym.reverte !== currentSpool?.status_acronym,
  //         process_next: PROCESS_STATUS.acronym.reservado,
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
  //              truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-lime-500 text-lime-100  hover:bg-lime-800 hover:text-lime-100 hover:shadow-lime-600 hover:shadow-md`,
  //         icon: "",
  //       };
  //     },
  //     SU: () => {
  //       return {
  //         name: "",
  //         title: "",
  //         disabled: false,
  //         process_next: () => {},
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
  //                 w-1/2 text-sm px-3 py-1 rounded-md h-16
  //                  truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md`,
  //         icon: "",
  //       };
  //     },
  //     RO: () => {
  //       return {
  //         name: "",
  //         title: "",
  //         disabled: false,
  //         process_next: () => {},
  //         class_name: `disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
  //                 w-1/2 text-sm px-3 py-1 rounded-md h-16
  //                  truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md`,
  //         icon: "",
  //       };
  //     },
  //   };

  //   return params[type];
  // }

  return (
    <section className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2">
      {children}
      {PROCESS_STATUS.acronym.reservado === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Incia processo produção"
          disabled={
            (!spool ||
              PROCESS_STATUS.acronym.reservado !==
                currentSpool?.status_acronym) &&
            PROCESS_STATUS.acronym.pausado !== currentSpool?.status_acronym &&
            PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.executando)}
          //onClick={action}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                  w-1/2 text-sm px-3 py-1 rounded-md h-16
                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
        >
          <PlayIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Iniciar</span>
        </Button>
      )}
      {PROCESS_STATUS.acronym.executando === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Pausar processo produção"
          disabled={
            !spool ||
            PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.pausado)}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-500 text-orange-100  hover:bg-orange-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
        >
          <PauseIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Pausar</span>
        </Button>
      )}
      {PROCESS_STATUS.acronym.pausado === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Continuar processo produção"
          disabled={
            !spool ||
            PROCESS_STATUS.acronym.pausado !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.continua)}
          className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16

                   truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-orange-400 text-orange-100  hover:bg-orange-600 hover:text-blue-100 hover:shadow-orange-700 hover:shadow-md"
        >
          <StepForwardIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Continuar</span>
        </Button>
      )}
      {PROCESS_STATUS.acronym.executando === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Finaliza processo produção"
          disabled={
            !spool ||
            PROCESS_STATUS.acronym.executando !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.finalizado)}
          className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-green-100 hover:shadow-green-600 hover:shadow-md"
        >
          <CheckCircleIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Finalizar</span>
        </Button>
      )}
      {PROCESS_STATUS.acronym.finalizado === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Avaliar qualidade produto"
          disabled={
            !spool ||
            PROCESS_STATUS.acronym.finalizado !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.romaneio)}
          className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none w-1/2 text-sm px-3 py-1 rounded-md h-16
               truncate min-w-20 text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
        >
          <RefreshCcwDotIcon className="size-4" />
          <span className="text-sm sm:text-base truncate">Aprova CQ</span>
        </Button>
      )}
      {PROCESS_STATUS.acronym.reverte === currentSpool?.status_acronym && (
        <Button
          type="button"
          title="Reverte produto para inicio"
          disabled={
            !spool ||
            PROCESS_STATUS.acronym.reverte !== currentSpool?.status_acronym
          }
          onClick={() => execute(PROCESS_STATUS.acronym.reservado)}
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
        // onClick={() => {
        //   onClose(), setScannerLocked(true), setSpool(null);
        // }}
        onClick={() => {
          onClose(), setScannerLocked(true), setSpool(null);
        }}
        className={`${currentSpool ? "w-1/2" : "w-full"} text-sm bg-red-600 hover:bg-red-600/50 hover:shadow-red-300 hover:text-stone-100  px-3 py-1 rounded-md text-stone-100 h-16 text-center flex flex-row gap-1 justify-center items-center`}
      >
        <XCircleIcon className="size-4" />
        Fechar
      </Button>
    </section>
  );
}
