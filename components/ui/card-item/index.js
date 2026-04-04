import { CalendarDaysIcon } from "lucide-react";

import { styleColorStatus } from "types/styles-color-status";

import { formatSixDigits } from "util/formatters/numeric";
import { formatCodeDefault } from "util/formatters/code";
import { formatDateCustom } from "util/formatters/date";

export default function CardItem({ item, index, children }) {
  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between px-2">
        <div className="flex flex-col justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800  ">
          <small className="px-2 bg-stone-300/50 rounded-full w-fit">
            {formatSixDigits(index + 1)}
          </small>
        </div>
        <div className="capitalize  text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
          <span
            className={`${styleColorStatus(item?.status_acronym)} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
          >
            <small> {item?.status}</small>
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full justify-center">
        <p className="w-full text-left px-2 py-2 text-xs sm:text-sm md:text-base">
          <strong>Código: </strong>
          {formatCodeDefault(item?.codigo)}
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
        <p
          colSpan={5}
          className="w-full px-2 py-2 text-xs sm:text-sm md:text-base text-left"
        >
          <small>
            <strong>Descrição:</strong> {item?.descricao}
          </small>
        </p>
      </div>

      {children}
    </div>
  );
}
