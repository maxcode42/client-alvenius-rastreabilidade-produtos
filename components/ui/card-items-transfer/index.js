import { PROCESS_STATUS } from "types/process-status";

import CardItemTransfer from "../card-item-transfer";

export default function CardItemsTransfer({ items, children }) {
  if (!items || items?.length === 0) return null;

  return (
    <ul className="md:justify-center md:items-center divide-y divide-stone-200 flex flex-col gap-4 py-2">
      {children}

      {items?.map((item, index) => (
        <li
          key={String(item?.codigo).concat(index)}
          className={`
            md:w-1/2  transition border-2 border-stone-200 
            shadow-stone-200 shadow-lg rounded-lg px-2 py-2 overflow-hidden 
            hover:shadow-blue-600/50 hover:shadow-md hover:bg-stone-50
            opacity-0
            translate-y-4
            animate-fadeInDown
            [animation-delay:${Math.min(index * 80, 800)}ms]
            animation-fill-mode:forwards
            ${
              PROCESS_STATUS?.acronym_next?.FI?.includes(item?.status_acronym)
                ? "bg-stone-300/50 shadow-none text-stone-800"
                : "bg-white"
            }
          `}
        >
          <CardItemTransfer item={item} index={index} />
        </li>
      ))}
    </ul>
  );
}
