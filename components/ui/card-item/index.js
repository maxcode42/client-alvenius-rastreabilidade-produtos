import { twMerge } from "tailwind-merge";
import CardItemsDate from "../card-items-date";
import CardItemsHeader from "../card-items-header";

import { formatCodeDefault } from "util/formatters/code";

export default function CardItem({ item, index, className, children }) {
  return (
    <div className={twMerge(`w-full`, className)}>
      <CardItemsHeader
        index={index}
        text={item?.text}
        badge={item?.badge}
        status={item?.status}
        acronym={item?.status_acronym}
        bgSubStatus={item?.bgSubStatus}
      />

      <div className="flex flex-col w-full justify-center order-1">
        <p className="w-full text-left px-2 py-2 text-xs sm:text-sm md:text-base">
          <strong>Código: </strong>
          {formatCodeDefault(item?.codigo) || item?.code}
        </p>
      </div>

      <CardItemsDate item={item} />

      {children}
    </div>
  );
}
