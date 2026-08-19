import { twMerge } from "tailwind-merge";

import { formatSixDigits } from "util/formatters/numeric";
import { styleColorStatus } from "types/styles-color-status";

export default function CardItemsHeader({
  text,
  index,
  badge,
  status,
  acronym,
  bgSubStatus,
}) {
  return (
    <div className="flex flex-row w-full justify-between px-2 order-0">
      <div className="flex flex-col justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800">
        <small className="px-2 bg-stone-300/50 rounded-full w-fit">
          {formatSixDigits(index + 1)}
        </small>
      </div>
      {!badge ? (
        <div className="capitalize text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
          <span
            className={twMerge(
              `bg-stone-300 p-1 text-xs rounded-full flex flex-row justify-center items-center`,
              styleColorStatus(acronym),
            )}
          >
            <small>{status}</small>
          </span>
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="z-50 capitalize text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
            <span
              className={twMerge(
                `p-1 text-xs rounded-full flex flex-row justify-center items-center border-r`,
                styleColorStatus(acronym),
              )}
            >
              <small>{status}</small>
            </span>
          </div>
          <div
            className={twMerge(
              `
              min-w-28 max-w-fit w-fit flex flex-row 
              py-1 pr-1 md:pl-6 md:pr-6 -ml-6 pr-2 
              text-xs rounded-full justify-end items-center`,
              bgSubStatus,
            )}
          >
            <small className="capitalize">{text.trimStart().trimEnd()}</small>
          </div>
        </div>
      )}
    </div>
  );
}
