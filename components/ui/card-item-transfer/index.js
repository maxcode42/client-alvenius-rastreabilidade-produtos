import { useState } from "react";
import { CalendarDaysIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import Button from "../button";

import { styleColorStatus } from "types/styles-color-status";

import { formatSixDigits } from "util/formatters/numeric";
import { formatCodeDefault } from "util/formatters/code";
import { formatDateCustom } from "util/formatters/date";

export default function CardItemTransfer({ item, index, children }) {
  const [expandItemIndex, setExpandItemIndex] = useState(null);

  if (!item || item?.spools?.length === 0) return null;

  function onExpandDetails(e, index) {
    e.preventDefault();

    setExpandItemIndex((prev) =>
      String(prev) === String(index) ? null : index,
    );
  }

  const status = [
    {
      text: "Aguardando SC",
      style: `z-50 -ml-0`,
      color: styleColorStatus("PU"),
      acronym: "SC",
    },
    {
      text: "Aguardando Pedido",
      style: `z-40 -ml-6 pl-6`,
      color: styleColorStatus("EX"),
      acronym: "AP",
    },
    {
      text: "Aguardando Nota",
      style: `z-30 -ml-6 pl-6`,
      color: styleColorStatus("RO"),
      acronym: "AN",
    },
    {
      text: "Nota Emitida",
      style: `z-20 -ml-6 pl-6`,
      color: styleColorStatus("FI"),
      acronym: "NT",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between px-2">
        <div className="flex flex-col justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800">
          <small className="px-2 bg-stone-300/50 rounded-full w-fit">
            {formatSixDigits(index + 1)}
          </small>
        </div>
        <div className="capitalize  text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
          <span
            className={`${item.status.includes("NT") ? styleColorStatus("FI") : styleColorStatus("RE")} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
          >
            {/* <small> {item?.status}</small> */}
            <small>
              {item.status.includes("NT") ? "Finalizado" : "Em trânsito"}
            </small>
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full justify-center">
        <p className="w-full text-left px-2 py-1 text-xs sm:text-sm md:text-base">
          <strong>Código: </strong>
          {item?.code}
        </p>

        <p className="w-full text-left px-2 py-1 text-xs sm:text-sm md:text-base">
          <strong>Fornecedor: </strong>
          {item?.supplier}
        </p>

        <div className="flex flex-row w-full items-center justify-between px-2 py-1">
          <p className="text-xs flex flex-col w-1/2 gap-1 items-start">
            <small className="flex flex-row gap-1">
              <CalendarDaysIcon className="size-4 text-slate-400" />
              <strong>Início:</strong>
            </small>
            <small>{formatDateCustom(item.dateStart, item.timeStart)}</small>
          </p>
          <div className="flex flex-col items-center justify-center bg-stone-200 w-[.2rem] h-8 rounded-full" />
          <p className="text-xs flex flex-col w-1/2 gap-1 items-end">
            <small className="flex flex-row items-start px-4 gap-1">
              <CalendarDaysIcon className="size-4 text-stone-400" />
              <strong>Finalizado:</strong>{" "}
            </small>
            <small>{formatDateCustom(item.dateEnd, item.timeEnd)}</small>
          </p>
        </div>

        <div key={index}>
          <div className="flex flex-row w-full gap-4 justify-start items-center">
            <p
              colSpan={5}
              className="w-10 lg:w-12 px-2 text-xs sm:text-sm md:text-base text-left"
            >
              <small>
                <strong>SPOOLS:</strong>
              </small>
            </p>
            <Button
              type="button"
              title="Expandir detalhes"
              onClick={(e) =>
                onExpandDetails(e, String(item?.code).concat(index))
              }
              className={`
                    ${
                      String(expandItemIndex) ===
                      String(item?.code).concat(index)
                        ? "border-stone-300/50 mb-1"
                        : "border-blue-600/50"
                    }
                    flex flex-col border-2 w-fit px-2 py-1 mt-0 border-2 
                    bg-transparent rounded-md items-center justify-center text-blue-800 
                    hover:text-blue-950/50 hover:bg-transparent focus:bg-transparent transition`}
            >
              {String(expandItemIndex) === String(item?.code).concat(index) ? (
                // <EyeOffIcon className="size-3 text-stone-300" />
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 15l-7-7-7 7" />
                </svg>
              ) : (
                // <EyeIcon className="size-3 text-blue-600" />
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 9l7 7 7-7" />
                </svg>
              )}
            </Button>
          </div>
          {expandItemIndex &&
            item?.spools?.map((spool, index) => (
              <div
                key={spool.concat(index)}
                className={`grid grid-cols-[1fr_auto] items-center gap-1 w-full
                  opacity-0
                  translate-y-4
                  animate-fadeInDown
                  [animation-delay:${20}ms]
                  animation-fill-mode:forwards
                `}
              >
                <p
                  key={String(index).concat(spool)}
                  className={`w-full flex flex-col px-4 text-xs sm:text-sm md:text-base text-left`}
                >
                  <small>
                    <strong>codigo:</strong> {formatCodeDefault(spool)}
                  </small>
                </p>
              </div>
            ))}
          <div className="w-full flex flex-col">
            <p
              colSpan={5}
              className="gap-1 justify-center px-2 py-2 text-xs sm:text-sm md:text-base text-left"
            >
              <small>
                <strong>Status:</strong>
              </small>
            </p>
          </div>
          <div className="flex flex-row w-full gap-1 items-center">
            {/* <div className="z-50 capitalize min-w-20">
              <span
                className={`${styleColorStatus("PU")} p-1 text-xs rounded-full flex flex-row w-fit justify-center items-center max-w-fit px-2`}
              >
                <small> {item?.status}</small>
              </span>
            </div>
            <div className="z-40 -ml-12 capitalize min-w-20">
              <span
                className={`${styleColorStatus("EX")}  p-1 pl-12 pr-1 text-xs rounded-full flex flex-row w-fit justify-center items-center max-w-fit px-2`}
              >
                <small> {"Aguardando Pedido"}</small>
              </span>
            </div>
            <div className="z-30 -ml-12 capitalize min-w-20">
              <span
                className={`${styleColorStatus("RO")}  p-1 pl-12 pr-1 text-xs rounded-full flex flex-row w-fit justify-center items-center max-w-fit px-2`}
              >
                <small> {"Aguardando nota"}</small>
              </span>
            </div>
            <div className="z-20 -ml-12 capitalize min-w-20">
              <span
                className={`${styleColorStatus("FI")}  p-1 pl-12 pr-1 text-xs rounded-full flex flex-row w-fit justify-center items-center max-w-fit px-2`}
              >
                <small> {"Nota Emitida"}</small>
              </span>
            </div> */}
            {status.map((i, index) => (
              <div
                key={i.acronym.concat(index)}
                className={`${
                  item?.status?.includes(i.acronym)
                    ? i.color
                    : "bg-stone-200 border-r-2 border-stone-100 pr-[.2rem] text-stone-400"
                } 
                  ${i?.style} min-w-20 max-w-fit w-fit flex flex-row 
                  py-1 pr-1 md:pl-6 md:pr-6 
                  text-xs rounded-full justify-center items-center`}
              >
                <small className="capitalize">
                  {i?.text.trimStart().trimEnd()}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
