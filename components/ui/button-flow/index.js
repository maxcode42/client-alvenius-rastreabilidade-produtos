import { Fragment, useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { twMerge } from "tailwind-merge";

import Button from "components/ui/button";

import { PROCESS_STATUS } from "types/process-status";

import { useQRCode } from "hooks/qr-code-context";

export default function ButtonFlow({
  item,
  action,
  displayButtonsOnCard,
  ...props
}) {
  const textAreaCharactersMin = 15;
  const { currentSpool, spool, data } = useQRCode();
  const [buttonDisabled, setButtonDisabled] = useState(
    // displayButtonsOnCard ? !spool : false,
    displayButtonsOnCard ? !displayButtonsOnCard : !spool,
  );

  let buttonsDisplay = displayButtonsOnCard
    ? PROCESS_STATUS?.acronym_next_card[item.status_acronym]
    : PROCESS_STATUS?.acronym_next[currentSpool?.status_acronym];

  async function execute(e, item, status) {
    await action(e, item, status);
  }

  const buttonAttribute = {
    EX: {
      name: "Iniciar",
      title: "Incia processo produção",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.reservado !== item?.status_acronym,
      process_next: PROCESS_STATUS.acronym.executando,
      class_name: `disabled:text-amber-100/50 bg-amber-500 text-amber-100 
                  hover:bg-amber-800 hover:text-amber-100 hover:shadow-amber-600`,
      icon: "PlayIcon",
    },
    PU: {
      name: "Pausar",
      title: "Pausar processo produção",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.executando !== item?.status_acronym,
      process_next: PROCESS_STATUS.acronym.pausado,
      class_name: `disabled:text-orange-100/50 bg-orange-500 text-orange-100
                   hover:bg-orange-800 hover:text-orange-100 hover:shadow-orange-400`,
      icon: "PauseIcon",
    },
    CO: {
      name: "Continuar",
      title: "Continuar processo produção",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.pausado !== item?.status_acronym,
      process_next: PROCESS_STATUS.acronym.continua,
      class_name: `disabled:text-orange-100/50 bg-orange-500 text-orange-100
                   hover:bg-orange-800 hover:text-orange-100 hover:shadow-orange-600`,
      icon: "StepForwardIcon",
    },
    FI: {
      name: "Finalizar",
      title: "Finaliza processo produção",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.executando !== item?.status_acronym,
      process_next: PROCESS_STATUS.acronym.finalizado,
      class_name: `disabled:text-green-100/50 bg-green-600 text-green-100
                   hover:bg-green-800 hover:text-green-100 hover:shadow-green-500`,
      icon: "CheckCircleIcon",
    },
    RO: {
      name: "Aprova CQ",
      title: "Avaliar qualidade produto",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.finalizado !== item?.status_acronym ||
        (!displayButtonsOnCard &&
          data?.qualityText?.length < textAreaCharactersMin),
      process_next: PROCESS_STATUS.acronym.romaneio,
      class_name: `disabled:text-sky-100/50 bg-sky-600 text-sky-100
                   hover:bg-sky-800 hover:text-sky-100 hover:shadow-sky-500
                  ${data?.accordance && !data?.reversible ? "" : "hidden"}
                  `,
      icon: "CheckCheckIcon",
    },
    RV: {
      name: "Reverter",
      title: "Retornar inicio do processo",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.finalizado !== item?.status_acronym ||
        data?.qualityText?.length < textAreaCharactersMin,
      process_next: PROCESS_STATUS.acronym.reverte,
      class_name: `disabled:text-lime-100/50 bg-lime-500 text-lime-100
                   hover:bg-lime-800 hover:text-lime-100 hover:shadow-lime-600
                  ${!data?.accordance && data?.reversible ? "" : "hidden"}
                  `,
      icon: "Repeat2Icon",
    },
    SU: {
      name: "Sucata",
      title: "Descarte do produto",
      disabled:
        buttonDisabled ||
        PROCESS_STATUS.acronym.finalizado !== item?.status_acronym ||
        data?.qualityText?.length < textAreaCharactersMin,
      process_next: PROCESS_STATUS.acronym.sucata,
      class_name: `disabled:text-red-100/50 bg-red-500 text-red-100 
                  hover:bg-red-800 hover:text-red-100 hover:shadow-red-600
                  ${!data?.accordance && !data?.reversible ? "" : "hidden"}
                  `,
      icon: "RefreshCwOffIcon",
    },
  };

  useEffect(() => {
    if (!displayButtonsOnCard) {
      setButtonDisabled(!spool);
    }
  }, [spool, item, displayButtonsOnCard]);

  return (
    <Fragment>
      {buttonsDisplay?.map((acronym, index) => {
        const attribute = buttonAttribute[acronym];
        const Icon = Icons[attribute?.icon];

        return (
          <Button
            type="button"
            key={attribute?.name.concat(index)}
            title={attribute?.title}
            disabled={attribute?.disabled}
            onClick={(e) => execute(e, item, attribute?.process_next)}
            //onClick={action}
            className={twMerge(
              `w-1/2 min-w-20 h-16 gap-1 flex flex-row px-3 py-1 
            truncate text-sm text-center items-center justify-center rounded-md 
            disable:cursor-not-allowed disabled:shadow-none hover:shadow-md
            `,
              attribute?.class_name,
              props.className,
            )}
          >
            {Icon && <Icon className="size-4" />}

            <span
              className={`${displayButtonsOnCard ? "text-xs" : "text-sm"} sm:text-base truncate`}
            >
              {attribute?.name}
            </span>
          </Button>
        );
      })}
    </Fragment>
  );
}
