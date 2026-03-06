import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PauseIcon,
  PlayIcon,
  RefreshCcwDotIcon,
  StepForwardIcon,
} from "lucide-react";

import { styleColorStatus } from "types/styles-color-status";

import { PROCESS_STATUS } from "types/process-status";
import { formatSixDigits } from "util/formatters/numeric";
import { formatCodeDefault } from "util/formatters/code";
import { formatDateCustom } from "util/formatters/date";

import Button from "components/ui/button";

import { useQRCode } from "hooks/qr-code-context";

export default function CardItems({ items, setText, children }) {
  const { setCurrentSpool, setOpenQRCode, setScannerLocked, setResult } =
    useQRCode();

  async function handlerData(text, _, item) {
    setText(text);
    setResult(null);
    setCurrentSpool(item);
    setScannerLocked(false);
    setOpenQRCode(true);
  }

  if (!items || items.length === 0) return null;

  return (
    <ul className="divide-y divide-stone-200 flex flex-col gap-4 py-2">
      {/* <li
        className={`flex flex-col divide-y divide-stone-200 rounded-sm bg-stone-200/50  
    items-center justify-center px-4 py-2 mt-4 gap-1 max-w-full shadow-md shadow-stone-300
    tracking-wider`}
      >
        <div className="grid grid-cols-[12vw_1fr_12vw] items-center gap-1 w-full justify-center">
          <button
            title="Expandir e ocultar o total processo"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 border-2 border-blue-950/50 rounded-md flex items-center justify-center text-blue-100 hover:text-blue-950/50 transition"
          >
            {isExpanded ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 15l-7-7-7 7" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 9l7 7 7-7" />
              </svg>
            )}
          </button>
          <span className="w-full min-full text-center text-sm font-semibold text-stone-700 uppercase">
            Processos
          </span>

          <span className="flex items-center justify-center min-w-12 max-w-[44px] px-2 text-stone-700 text-sm font-semibold tabular-nums">
            QTD.
          </span>
        </div>

        {isExpanded &&
          quantityPerProcess.map((item) => (
            <div
              key={item?.name}
              className="grid grid-cols-[1fr_auto] items-center gap-1 py-1 w-full"
            >
              <div className="flex flex-row leading-tight items-center gap-1">
                <span className="text-sm font-semibold text-stone-700 capitalize">
                  {item?.name}
                </span>

                <span className="text-xs text-stone-500 line-clamp-2">
                  {item?.description}
                </span>
              </div>

              <span className="mt-[.2em] flex items-center justify-center self-stretch h-full min-w-[44px] px-2 rounded-md bg-stone-600 text-blue-100 text-sm font-semibold tabular-nums">
                {formatSixDigits(item?.quantity)}
              </span>
            </div>
          ))}

        <Separator className="via-stone-400/50 mt-2 -mb-2" />
        <div className="flex flex-row w-full justify-between border-none items-center text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 gap-2 py-2">
          <span className="text-sm font-semibold text-stone-700">
            TOTAL SPOOL
          </span>

          <span className="mt-[.2em] flex items-center justify-center min-w-[44px] px-2 py-1 rounded-md bg-blue-600 text-blue-100 text-sm font-semibold tabular-nums">
            {formatSixDigits(items?.length || 0)}
          </span>
        </div>
      </li> */}

      {children}

      {items?.map((item, index) => (
        <li
          key={String(item?.codigo).concat(index)}
          className={`hover:bg-stone-50 transition odd:bg-white px-2 py-2 border-2 border-stone-200 rounded-lg shadow-lg
             opacity-0
              translate-y-4
              animate-fadeInUp
              [animation-delay:${Math.min(index * 80, 800)}ms]
              animation-fill-mode:forwards
            `}
        >
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row justify-center gap-1">
              <div className="flex flex-col  justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800  ">
                <small className="px-2 bg-stone-300/50 rounded-full w-fit">
                  {formatSixDigits(index + 1)}
                </small>
              </div>
              <p className="flex flex-row justify-center items-center gap-1 px-2 py-2 text-xs sm:text-sm md:text-base text-stone-800">
                <strong>Código: </strong>
                {formatCodeDefault(item?.codigo)}
              </p>
            </div>
            <div className="capitalize px-2 py-2 text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
              <span
                className={
                  `p-1 text-xs rounded-full flex flex-row justify-center items-center ${" "} 
                  ${String(styleColorStatus(item?.status_sigle))}`
                  //${String(colorStatus[item.status_sigle]).replace('""', "").replace('""', "")}`
                }
              >
                <small> {item?.status}</small>
              </span>
            </div>
          </div>
          <div className="flex flex-col py-1">
            <div className="flex flex-row justify-between px-2 py-1">
              <p className="text-xs flex flex-col w-1/2 gap-1">
                <small className="flex flex-row gap-1">
                  <CalendarDaysIcon className="size-4 text-slate-400" />
                  <strong>Início:</strong>
                </small>
                <small>
                  {formatDateCustom(item.dateStart, item.timeStart)}
                </small>
              </p>
              <div className="flex flex-col items-center justify-center bg-stone-200 w-[.2rem] h-8 rounded-full" />
              <p className="text-xs flex flex-col w-1/2 px-4 gap-1">
                <small className="flex flex-row gap-1">
                  <CalendarDaysIcon className="size-4 text-stone-400" />
                  <strong>Finalizado:</strong>{" "}
                </small>
                <small>{formatDateCustom(item.dateEnd, item.timeEnd)}</small>
              </p>
            </div>
            <p
              colSpan={5}
              className=" px-2 py-2 text-xs sm:text-sm md:text-base text-stone-800"
            >
              <small>
                <strong>Descrição:</strong> {item?.descricao}
              </small>
            </p>
          </div>
          <div className="flex flex-col h-[.1vh] shadow-sm shadow-stone-200 bg-blue-300/50 w-full mb-2 rounded-full" />
          <div className="flex flex-row w-full gap-1 py-1">
            <div className="w-1/3">
              {PROCESS_STATUS.sigle.pausado !== item?.status_sigle &&
                PROCESS_STATUS.sigle.executando !== item?.status_sigle && (
                  <Button
                    type="button"
                    title="Incia processo produção"
                    disabled={
                      PROCESS_STATUS.sigle.reservado !== item?.status_sigle
                    }
                    onClick={() =>
                      handlerData(
                        "INICIAR",
                        PROCESS_STATUS.sigle.executando,
                        item,
                      )
                    }
                    className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                   truncate w-full min-w-20 text-xs py-2 px-1 rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
                  >
                    <PlayIcon className="size-4" />
                    <span className="text-xs sm:text-base truncate">
                      Iniciar
                    </span>
                  </Button>
                )}
              {PROCESS_STATUS.sigle.executando === item?.status_sigle && (
                <Button
                  type="button"
                  title="Pausar processo produção"
                  disabled={
                    PROCESS_STATUS.sigle.executando !== item?.status_sigle
                  }
                  onClick={() =>
                    handlerData("PAUSAR", PROCESS_STATUS.sigle.pausado, item)
                  }
                  className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                   truncate w-full min-w-20 text-xs py-2 px-1 rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-orange-500 text-orange-100  hover:bg-orange-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
                >
                  <PauseIcon className="size-4" />
                  <span className="text-xs sm:text-base truncate">Pausar</span>
                </Button>
              )}
              {PROCESS_STATUS.sigle.pausado === item?.status_sigle && (
                <Button
                  type="button"
                  title="Continuar processo produção"
                  disabled={PROCESS_STATUS.sigle.pausado !== item?.status_sigle}
                  onClick={() =>
                    handlerData(
                      "Continuar",
                      PROCESS_STATUS.sigle.continua,
                      item,
                    )
                  }
                  className="
                  disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none
                   truncate w-full min-w-20 text-xs py-2 px-1 rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-orange-400 text-orange-100  hover:bg-orange-600 hover:text-blue-100 hover:shadow-orange-700 hover:shadow-md"
                >
                  <StepForwardIcon className="size-4" />
                  <span className="text-xs sm:text-base truncate">
                    Continuar
                  </span>
                </Button>
              )}
            </div>
            <div className="w-1/3">
              <Button
                type="button"
                title="Finaliza processo produção"
                disabled={
                  PROCESS_STATUS.sigle.executando !== item?.status_sigle
                }
                onClick={() =>
                  handlerData(
                    "FINALIZAR",
                    PROCESS_STATUS.sigle.finalizado,
                    item,
                  )
                }
                className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none truncate w-full min-w-20 py-2 px-1 text-xs rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-green-100 hover:shadow-green-600 hover:shadow-md"
              >
                <CheckCircleIcon className="size-4" />
                <span className="text-xs sm:text-base truncate">Finalizar</span>
              </Button>
            </div>
            <div className="w-1/3 ">
              <Button
                type="button"
                title="Avaliar qualidade produto"
                disabled={
                  PROCESS_STATUS.sigle.finalizado !== item?.status_sigle
                }
                onClick={() =>
                  handlerData("Qualidade", PROCESS_STATUS.sigle.romaneio, item)
                }
                className="disabled:bg-stone-300 disable:cursor-not-allowed disabled:shadow-none truncate w-full  min-w-20 py-2 px-1 text-xs rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
              >
                <RefreshCcwDotIcon className="size-4" />
                <span className="text-xs sm:text-base truncate">Aprova CQ</span>
              </Button>
            </div>
          </div>
        </li>
      ))}
      <li className="rounded-md bg-stone-200 flex flex-row items-center px-4 py-2 mt-4">
        <p className="text-xs text-stone-600 font-bold tracking-wider flex flex-row gap-2">
          <span>{formatSixDigits(items?.length || 0)}</span>
          <span>TOTAL ITENS</span>
        </p>
      </li>
    </ul>
  );
}
