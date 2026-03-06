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
      PROCESS_STATUS.sigle.sucata === item?.status_sigle ||
      PROCESS_STATUS.sigle.romaneio === item?.status_sigle
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

      {/* <li className="rounded-sm bg-stone-200/50 flex flex-col items-start justify-center px-4 py-2 mt-4 gap-1 max-w-full shadow-md shadow-stone-300">
        <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2">
          <span className="w-full text-center justify-center items-center uppercase">
            Processos
          </span>
          <span className="min-w-8 max-w-10 text-center">QTD.</span>
        </p>

        {quantityPerProcess.map((item) => (
          <p
            key={item?.name}
            className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2"
          >
            <span className="w-fit gap-1 flex flex-row">
              <span className="capitalize">{item?.name}</span>
              <span className="font-normal">{item?.description}</span>:
            </span>
            <span className="min-w-8 max-w-10 text-end">
              {formatSixDigits(item?.quantity)}
            </span>
          </p>
        ))}
        {/* <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2">
          <span className="w-fit">
            Reservado <span className="font-normal">(aguardando inicio)</span>:
          </span>
          <span className="min-w-8 max-w-10 text-end">
            {formatSixDigits(quantityPerProcess?.reservado)}
          </span>
        </p>

        <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2">
          <span className="w-fit">
            Execução <span className="font-normal">(em processo execução)</span>
            :
          </span>
          <span className="min-w-8 max-w-10 text-end">
            {formatSixDigits(quantityPerProcess?.execução)}
          </span>
        </p>
        <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2">
          <span className="w-fit">
            Pausado{" "}
            <span className="font-normal">(aguardando para continuar)</span>:
          </span>
          <span className="min-w-8 max-w-10 text-end">
            {formatSixDigits(quantityPerProcess?.pausado)}
          </span>
        </p>
        <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2">
          <span className="w-fit">
            Finalizado{" "}
            <span className="font-normal">({`aguardando "Aprova CQ"`})</span>:
          </span>
          <span className="min-w-8 max-w-10 text-end">
            {formatSixDigits(quantityPerProcess?.finalizado)}
          </span>
        </p> */}
      {/* <Separator className="via-stone-400/50" />
        <p className="flex flex-row w-full justify-between text-xs text-stone-600 font-bold tracking-wider break-words line-clamp-2 items-start  gap-2 mt-1">
          <span className="w-fit">TOTAL SPOOL</span>
          <span className="min-w-8 max-w-10 text-end">
            {formatSixDigits(items?.length || 0)}
          </span>
        </p>
      </li> */}

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
              ${PROCESS_STATUS.sigle.sucata === item?.status_sigle || PROCESS_STATUS.sigle.romaneio === item?.status_sigle ? "bg-stone-300/50 shadow-none text-stone-800" : "bg-white"}
            `}
        >
          {/* <li className="hover:bg-stone-50 transition odd:bg-white border-2 border-stone-200 rounded-lg shadow-lg"> */}
          <Button
            type="button"
            title={`Ler QRCode produto código ${item?.codigo}`}
            // disabled={
            //   item?.status_sigle === "SU" || item?.status_sigle === "RO"
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
                  className={`${styleColorStatus(item?.status_sigle)} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
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
      {/* <li className="rounded-md bg-stone-200 flex flex-row items-center px-4 py-2 mt-4">
        <p className="text-xs text-stone-600 font-bold tracking-wider flex flex-row gap-2">
          <span>{formatSixDigits(items?.length || 0)}</span>
          <span>TOTAL ITENS</span>
        </p>
      </li> */}
    </ul>
  );
}
