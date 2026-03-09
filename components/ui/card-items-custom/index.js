import { CalendarDaysIcon } from "lucide-react";

import { styleColorStatus } from "types/styles-color-status";

import { PROCESS_STATUS } from "types/process-status";
import { formatSixDigits } from "util/formatters/numeric";
import { formatCodeDefault } from "util/formatters/code";
import { formatDateCustom } from "util/formatters/date";

import Button from "components/ui/button";

import { useQRCode } from "hooks/qr-code-context";

export default function CardItemsCustom({ items, children }) {
  const {
    setOpenAlert,
    setOpenQRCode,
    setMessage,
    setCurrentSpool,
    setScannerLocked,
    setResult,
  } = useQRCode();

  async function openModalQRCode(e, item) {
    e.preventDefault();
    if (
      PROCESS_STATUS.acronym.sucata === item?.status_acronym ||
      PROCESS_STATUS.acronym.romaneio === item?.status_acronym
    ) {
      setMessage(
        `Processo produção encerrado para esse SPOOL, selecione outro card.`,
      );
      setOpenAlert(true);
      return;
    }

    await setResult(null);
    await setCurrentSpool(item);
    await setScannerLocked(false);
    await setOpenQRCode(true);
  }

  if (!items || items?.length === 0) return null;

  return (
    <ul className="divide-y divide-stone-200 flex flex-col gap-4 py-2">
      <div className="w-full border-2 border-stone-300 rounded-lg bg-stone-100 shadow-sm shadow-blue-500/50">
        <h3 className="text-md text-center font-semibold py-2">
          Clique no código SPOOL para continuar
        </h3>
      </div>

      {children}

      {items?.map((item, index) => (
        <li
          key={String(item?.codigo).concat(index)}
          className={`
            hover:bg-stone-50 transition  border-2 border-stone-200 rounded-lg shadow-lg
              opacity-0
              translate-y-4
              animate-fadeInDown
              [animation-delay:${Math.min(index * 80, 800)}ms]
              animation-fill-mode:forwards
              ${PROCESS_STATUS.acronym.sucata === item?.status_acronym || PROCESS_STATUS.acronym.romaneio === item?.status_acronym ? "bg-stone-300/50 shadow-none text-stone-800" : "bg-white"}
            `}
        >
          {/* <li className="hover:bg-stone-50 transition odd:bg-white border-2 border-stone-200 rounded-lg shadow-lg"> */}
          <Button
            type="button"
            title={`Ler QRCode produto código ${item?.codigo}`}
            // disabled={
            //   item?.status_acronym === "SU" || item?.status_acronym === "RO"
            // }
            onClick={(e) => openModalQRCode(e, item)}
            className={`
                  //disabled:bg-stone-300/50 disabled:cursor-not-allowed disabled:shadow-none text-stone-800
                  flex flex-col items-start justify-center bg-transparent
                   w-full min-w-full rounded-md px-2 py-2 hover:bg-stone-100 hover:shadow-blue-600/50 hover:shadow-md hover:text-stone-800
                  `}
          >
            <div className="flex flex-row w-full justify-between px-2">
              <div className="flex flex-col  justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800  ">
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
                  <small>
                    {formatDateCustom(item.dateStart, item.timeStart)}
                  </small>
                </p>
                <div className="flex flex-col items-center justify-center bg-stone-200 w-[.2rem] h-8 rounded-full" />
                <p className="text-xs flex flex-col w-1/2 px-4 gap-1 items-start">
                  <small className="flex flex-row gap-1">
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
          </Button>
        </li>
      ))}
    </ul>
  );
}
