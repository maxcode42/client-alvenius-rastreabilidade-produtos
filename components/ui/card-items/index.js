import CardItemsButton from "../card-items-button";
import CardItem from "../card-item";

import { useQRCode } from "hooks/qr-code-context";

import { formatDateCustom } from "util/formatters/date";
import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";

export default function CardItems({ items, enabled, children }) {
  const {
    setScannerLocked,
    setCurrentSpool,
    setOpenQRCode,
    setOpenAlert,
    setMessage,
    setResult,
    setSpool,
  } = useQRCode();

  function openModalQRCode(e, item) {
    e.preventDefault();

    if (PROCESS_STATUS?.acronym_next?.FI?.includes(item?.status_acronym)) {
      setMessage(
        `Processo produção encerrado para esse SPOOL, selecione outro card.`,
      );
      setOpenAlert(true);
      return;
    }

    setSpool(null);
    setResult(null);
    setCurrentSpool(item);
    setScannerLocked(false);
    setOpenQRCode(true);
  }

  if (!items || items?.length === 0) return null;

  return (
    <ul className="lg:justify-center lg:items-center divide-y divide-stone-200 flex flex-col gap-4 py-2">
      <div className="w-full lg:w-1/2 border-2 border-stone-300 rounded-lg bg-stone-100 shadow-sm shadow-blue-500/50">
        <h3 className="text-md text-center font-semibold py-2">
          Clique no código SPOOL para continuar
        </h3>
      </div>

      {children}

      {items?.map((item, index) => (
        <li
          key={String(item?.codigo).concat(index)}
          className={`
            lg:w-1/2 transition border-2 border-stone-200 
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
          <CardItemsButton item={item} action={(e) => openModalQRCode(e, item)}>
            <CardItem item={item} index={index}>
              <p className="w-full px-2 py-2 text-xs sm:text-sm md:text-base text-left">
                <small>
                  <strong>Descrição:</strong> {item?.description}
                </small>
              </p>
              <div>
                <div className="flex flex-row w-full gap-4 justify-start items-center">
                  <p
                    className={`px-2 text-xs sm:text-sm md:text-base text-left`}
                  >
                    <small>
                      <span className="bg-stone-200 px-1 mr-1 rounded-full">
                        {" "}
                        {String(item?.history.length).padStart(2, "0")}
                      </span>
                      <strong>Histórico de sucata: </strong>
                    </small>
                  </p>
                </div>
                {enabled &&
                  item?.history.map((i, index) => (
                    <div
                      key={i.date.concat(index)}
                      className={`grid grid-cols-[1fr_auto] items-center gap-1 w-full
                            opacity-0
                            translate-y-4
                            animate-fadeInDown
                            [animation-delay:${20}ms]
                            animation-fill-mode:forwards
                            mt-1
                          `}
                    >
                      <p
                        key={String(index).concat(i)}
                        className={`w-full flex flex-col px-4 text-xs sm:text-sm md:text-base text-left`}
                      >
                        <small>
                          {formatDateCustom(i.date, i?.time)} |{" "}
                          <strong className="capitalize">
                            {PROCESS_FLOW.name[i.process]}{" "}
                          </strong>
                        </small>
                      </p>
                    </div>
                  ))}
              </div>
            </CardItem>
          </CardItemsButton>
        </li>
      ))}
    </ul>
  );
}
