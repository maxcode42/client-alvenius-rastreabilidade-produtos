import { useMemo, useState } from "react";
import { CalendarDaysIcon } from "lucide-react";

import Button from "../button";

import { styleColorStatus } from "types/styles-color-status";

import { formatSixDigits } from "util/formatters/numeric";
import { formatCodeDefault } from "util/formatters/code";
import { formatDateCustom } from "util/formatters/date";

export default function CardItemTransfer({ item, status, index, children }) {
  const [expandItemIndex, setExpandItemIndex] = useState(null);

  if (!item || item?.spools?.length === 0) return null;

  function onExpandDetails(e, index) {
    e.preventDefault();

    setExpandItemIndex((prev) =>
      String(prev) === String(index) ? null : index,
    );
  }

  const statusList = useMemo(() => {
    return [
      {
        text: status[0].text,
        // style: `z-40 text-[0.8em] text-center -ml-0 p-3 pr-3 `,
        style: `z-50 ml-1 md:pl-1`,
        color: styleColorStatus("PU"),
        acronym: status[0].acronym,
      },
      {
        text: status[1].text,
        // style: `z-40 text-[0.8em] text-center -ml-10 pl-9 md:pl-14 bg-gradient-to-r`,
        // style: `z-40 w-6 text-[0.8em] text-center relative px-4 text-stone-100 rounded-full -ml-3`,
        style: `z-40 pl-5`,
        color: styleColorStatus("EX"),
        acronym: status[1].acronym,
      },
      {
        text: status[2].text,
        // style: `z-30 text-[0.8em] text-center -ml-10 pl-9 md:pl-14`,
        // style: `z-30 w-6 text-[0.8em] text-center relative px-4 text-white rounded-full -ml-3`,
        style: `z-30 pl-5`,
        color: styleColorStatus("RO"),
        acronym: status[2].acronym,
      },
      {
        text: status[3].text,
        // style: `z-20 text-[0.8em] text-center -ml-10 pl-9 md:pl-14`,
        // tyle: `z-20 w-6 text-[0.8em] text-center relative px-4 text-white rounded-full -ml-3`,
        style: `z-20 pl-5`,
        color: styleColorStatus("RV"),
        acronym: status[3].acronym,
      },
      {
        text: status[4].text,
        // style: `z-10 text-[0.8em] text-center -ml-10 pl-9 md:pl-14`,
        // tyle: `z-10 w-6 text-[0.8em] text-center relative px-4 text-white rounded-full -ml-3`,
        style: `z-10 pl-5`,
        color: styleColorStatus("FI"),
        acronym: status[4].acronym,
      },
    ];
  }, []);

  function typeLayoutStatus(type) {
    const typesStatus = {
      status: () => {
        return (
          <div className="w-full">
            <div className="flex flex-row w-full justify-between px-2">
              <div className="flex flex-col justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800">
                <small className="px-2 bg-stone-300/50 rounded-full w-fit">
                  {formatSixDigits(index + 1)}
                </small>
              </div>{" "}
              <div className="capitalize text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
                <span
                  className={`${item.status.length === status.length ? styleColorStatus("FI") : styleColorStatus("RE")} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
                >
                  <small>
                    {item.status.length === status.length
                      ? "Finalizado"
                      : "Em trânsito"}
                  </small>
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full justify-center">
              <p className="w-full text-left px-2 py-1 text-xs sm:text-sm md:text-base">
                <strong>Código: </strong>
                {item?.code}
              </p>

              <div className="w-full flex flex-col py-1">
                <p className="w-full text-left px-2 text-xs sm:text-sm md:text-base">
                  <small>
                    <strong>Fornecedor: </strong>
                  </small>
                </p>

                <p className="w-full flex flex-row text-left px-2 gap-1 text-xs sm:text-sm md:text-base">
                  <small className="flex flex-row gap-1">
                    <strong>Origem:</strong>
                    <span className="max-w-8 min-w-8">
                      {item?.supplier?.origin?.code}
                    </span>
                    {" - "}
                    <span className="max-w-4 min-w-4 text-center">
                      {item?.supplier?.origin?.store}
                    </span>
                    {" - "}
                    <span className="truncate w-fit max-w-[60%]">
                      {item?.supplier?.origin?.name}
                    </span>
                  </small>
                </p>

                <p className="w-full text-left px-2 text-xs sm:text-sm md:text-base">
                  <small className="flex flex-row gap-1">
                    <strong>Destino: </strong>

                    <span className="max-w-8 min-w-8">
                      {item?.supplier?.destination?.code}
                    </span>
                    {" - "}

                    <span className="max-w-4 min-w-4 text-center">
                      {item?.supplier?.destination?.store}
                    </span>
                    {" - "}

                    <span className="truncate w-fit max-w-[60%]">
                      {item?.supplier?.destination?.name}
                    </span>
                  </small>
                </p>
              </div>

              <div className="flex flex-row w-full items-center justify-between px-2 py-2">
                <p className="text-xs flex flex-col w-1/2 gap-1 items-start">
                  <small className="flex flex-row gap-1">
                    <CalendarDaysIcon className="size-4 text-slate-400" />
                    <strong>Início:</strong>
                  </small>
                  <small>
                    {formatDateCustom(item.dateStart, item.timeStart)}
                  </small>
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

              <div>
                <div className="flex flex-row w-full gap-4 justify-start items-center">
                  <p className="w-10 lg:w-12 px-2 text-xs sm:text-sm md:text-base text-left">
                    <small>
                      <strong>Spools:</strong>
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
                    {String(expandItemIndex) ===
                    String(item?.code).concat(index) ? (
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
              </div>

              <div className="w-full flex flex-col">
                <p className="gap-1 justify-center px-2 py-2 text-xs sm:text-sm md:text-base text-left">
                  <small>
                    <strong>Status:</strong>
                  </small>
                </p>
                <div className="flex flex-row w-full gap-1 items-center">
                  {statusList.map((i, index) => (
                    // <div
                    //   key={i.acronym.concat(index)}
                    //   className={`${
                    //     item?.status?.includes(i.acronym)
                    //       ? i.color
                    //       : "bg-stone-200 border-r-2 border-stone-100 pr-[.2rem] text-stone-400"
                    //   }
                    //   ${i?.style} min-w-20 max-w-fit w-fit flex flex-row
                    //   py-1 pr-1 md:pl-6 md:pr-6
                    //   text-xs rounded-full justify-center items-center`}
                    // >
                    <div
                      key={i.acronym.concat(index)}
                      className={`relative
                        ${
                          item?.status?.includes(i.acronym)
                            ? i.color
                            : "bg-stone-200 text-stone-400"
                        }
                        text-[0.6em] md:text-[0.8em] text-left rounded-r-full
                        min-w-18 md:min-w-20 max-w-fit w-fit
                        flex items-center justify-center
                        py-1 pr-1 md:pr-1 -ml-4 
                        ${i?.style}
                      `}
                      // ${index !== 0 ? "-ml-3" : ""}
                      // style={{ zIndex: statusList.length - index }}
                    >
                      {index !== 0 && (
                        <div className=" absolute left-0 top-0 h-full w-8 bg-stone-100 rounded-full -translate-x-1/2" />
                      )}

                      <small className="capitalize relative">
                        {i?.text.trim()}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {children}
          </div>
        );
      },
      status_badge: () => {
        return (
          <div className="w-full">
            <div className="flex flex-row w-full justify-between px-2">
              <div className="flex flex-col justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800">
                <small className="px-2 bg-stone-300/50 rounded-full w-fit">
                  {formatSixDigits(index + 1)}
                </small>
              </div>

              <div className="flex flex-row">
                <div className="z-50 capitalize text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
                  <span
                    className={`${item.status.length === status.length ? styleColorStatus("FI") : styleColorStatus("RE")} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
                  >
                    <small>
                      {item.status.length === status.length
                        ? "Finalizado"
                        : "Em trânsito"}
                    </small>
                  </span>
                </div>
                <div
                  className={`${status[item.status.length - 1].color} 
                    min-w-28 max-w-fit w-fit flex flex-row 
                    py-1 pr-1 md:pl-6 md:pr-6 -ml-5 pr-2 
                    text-xs rounded-full justify-end items-center`}
                >
                  <small className="capitalize">
                    {statusList[item.status.length - 1]?.text
                      .trimStart()
                      .trimEnd()}
                  </small>
                </div>
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
                  <small>
                    {formatDateCustom(item.dateStart, item.timeStart)}
                  </small>
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
                    {String(expandItemIndex) ===
                    String(item?.code).concat(index) ? (
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
              </div>
            </div>

            {children}
          </div>
        );
      },
    };
    const ex = typesStatus[type];

    return ex();
  }

  return typeLayoutStatus("status");
  // return typeLayoutStatus("status_badge");
}
