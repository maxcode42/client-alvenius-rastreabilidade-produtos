import { useState } from "react";

import Separator from "../separator";
import { formatSixDigits } from "util/formatters/numeric";
import { styleColorStatus } from "types/styles-color-status";

export default function QuantitiesItens({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ul
      className={`divide-y divide-stone-200 flex flex-col gap-4 py-2
      opacity-0
              translate-y-4
              animate-fadeInDown
              [animation-delay:${Math.min(120)}ms]
              animation-fill-mode:forwards
    `}
    >
      <li
        className={`flex flex-col divide-y divide-stone-200 rounded-sm bg-stone-200/50  
    items-center justify-center px-4 py-2 mt-4 gap-1 max-w-full shadow-md shadow-stone-300
    tracking-wider`}
      >
        <div className="grid grid-cols-[5vw_auto_12vw] items-center gap-1 py-2 w-full">
          <button
            title="Expandir e ocultar o total processo"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 border-2 border-blue-950/50 rounded-md flex items-center justify-center text-blue-800 hover:text-blue-950/50 transition"
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

          <span className="text-center text-xs font-semibold text-stone-700 uppercase ">
            Processos
          </span>

          <span className="flex items-center justify-center px-2 text-stone-700 text-xs font-semibold tabular-nums">
            QTD.
          </span>
        </div>

        {isExpanded &&
          data?.items?.map((item) => (
            <div
              key={item?.name}
              className={`grid grid-cols-[1fr_auto] items-center gap-1 w-full
                  opacity-0
                  translate-y-4
                  animate-fadeInDown
                  [animation-delay:${20}ms]
                  animation-fill-mode:forwards
                `}
            >
              <div className="flex flex-row leading-tight items-center gap-2">
                <div className="capitalize py-1 text-center min-w-2 text-xs sm:text-sm md:text-base text-stone-800">
                  <span
                    className={`w-2 p-2 text-xs rounded-full flex flex-row justify-center items-center ${" "} 
                      ${String(styleColorStatus(item?.status_acronym))}`}
                  ></span>
                </div>
                <span className="text-xs font-semibold text-stone-700 capitalize">
                  {item?.name}
                </span>

                <span className="text-xs text-stone-500 line-clamp-2">
                  <small>{item?.description}</small>
                </span>
              </div>
              <div className="flex flex-row items-center gap-1 py-1">
                <span className="flex items-center justify-center self-stretch h-[1.7em] px-2 rounded-md bg-stone-600 text-blue-100 text-xs font-semibold tabular-nums">
                  <small>{formatSixDigits(item?.quantity)}</small>
                </span>
              </div>
            </div>
          ))}

        <Separator className="via-stone-400/50 mt-2 -mb-2" />
        <div
          className={`flex flex-row w-full justify-between border-none items-center text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 gap-2 py-2
          ${
            isExpanded
              ? `opacity-0
              translate-y-4
              animate-fadeInDown
             [animation-delay:${20}ms]
              animation-fill-mode:forwards`
              : `opacity-0
              translate-y-4
              animate-fadeInUp
             [animation-delay:${20}ms]
              animation-fill-mode:forwards`
          }
          `}
        >
          <span className="text-xs font-semibold text-stone-700">TOTAL</span>

          <div className="flex flex-row items-center gap-1 py-1">
            <span className="flex items-center justify-center self-stretch h-[1.7em] px-2 rounded-md bg-blue-600 text-blue-100 text-xs font-semibold tabular-nums">
              <small> {formatSixDigits(data?.total || 0)}</small>
            </span>
          </div>
        </div>
      </li>
    </ul>
  );
}
