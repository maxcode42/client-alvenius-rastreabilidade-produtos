import { CalendarDaysIcon } from "lucide-react";
import { formatDateCustom } from "util/formatters/date";

export default function CardItemsDate({ item }) {
  return (
    <div className="flex flex-row w-full items-center justify-between px-2 py-1">
      <p className="text-xs flex flex-col w-1/2 gap-1 items-start">
        <small className="flex flex-row gap-1">
          <CalendarDaysIcon className="size-4 text-stone-400" />
          <strong>Início:</strong>
        </small>
        <small>{formatDateCustom(item.dateStart, item.timeStart)}</small>
      </p>
      <div className="flex flex-col items-center justify-center bg-stone-200 w-[.2rem] h-8 rounded-full" />
      <p className="text-xs flex flex-col w-1/2 gap-1 items-end">
        <span>
          <small className="flex flex-row items-start gap-1 py-1">
            <CalendarDaysIcon className="size-4 text-stone-400" />
            <strong>Finalizado:</strong>{" "}
          </small>
          <small>{formatDateCustom(item.dateEnd, item.timeEnd)}</small>
        </span>
      </p>
    </div>
  );
}
