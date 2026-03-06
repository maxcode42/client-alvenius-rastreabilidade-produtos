import { useState } from "react";

import Separator from "../separator";
import { formatSixDigits } from "util/formatters/numeric";

export default function QuantitiesItens({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(data);
  // const PROCESS_DESCRIPTION = {
  //   reservado: "(aguardando incio)",
  //   execução: "(em processo produção)",
  //   pausado: "(aguardando para continuar)",
  //   finalizado: `(aguardando "Aprova CQ")`,
  //   romaneio: "(aguardando proxima etapa)",
  // };

  // const quantityPerProcess = useMemo(() => {
  //   const counts = items?.reduce((acc, item) => {
  //     const status = item?.status?.toLowerCase();
  //     if (!status) return acc;

  //     acc[status] = (acc[status] || 0) + 1;

  //     return acc;
  //   }, {});

  //   return Object.keys(PROCESS_DESCRIPTION).map((status) => ({
  //     name: status,
  //     description: PROCESS_DESCRIPTION[status],
  //     quantity: counts?.[status] || 0,
  //   }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [items]);

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
        <div className="grid grid-cols-[12vw_1fr_12vw] items-center gap-1 w-full justify-center">
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
          <span className="w-full min-full text-center text-xs font-semibold text-stone-700 uppercase">
            Processos
          </span>

          <span className="flex items-center justify-center min-w-12 max-w-[44px] px-2 text-stone-700 text-xs font-semibold tabular-nums">
            QTD.
          </span>
        </div>

        {isExpanded &&
          data?.items?.map((item) => (
            <div
              key={item?.name}
              className={`grid grid-cols-[1fr_auto] items-center gap-1 py-1 w-full
                  opacity-0
                  translate-y-4
                  animate-fadeInDown
                  [animation-delay:${20}ms]
                  animation-fill-mode:forwards
                `}
            >
              <div className="flex flex-row leading-tight items-center gap-1">
                <span className="text-xs font-semibold text-stone-700 capitalize">
                  {item?.name}
                </span>

                <span className="text-xs text-stone-500 line-clamp-2">
                  {item?.description}
                </span>
              </div>

              <span className="mt-[.2em] flex items-center justify-center self-stretch h-full min-w-[44px] px-2 rounded-md bg-stone-600 text-blue-100 text-xs font-semibold tabular-nums">
                {formatSixDigits(item?.quantity)}
              </span>
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

          <span className="mt-[.2em] flex items-center justify-center min-w-[44px] px-2 py-1 rounded-md bg-blue-600 text-blue-100 text-xs font-semibold tabular-nums">
            {formatSixDigits(data?.total || 0)}
          </span>
        </div>
      </li>
    </ul>
  );
}
