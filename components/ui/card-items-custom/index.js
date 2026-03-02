import { CalendarDaysIcon } from "lucide-react";

import Button from "components/ui/button";
import Separator from "../separator";
import Loading from "../loading";

import { useQRCode } from "hooks/qr-code-context";

export default function CardItemsCustom({
  items,
  //setMessage,
  //setOpenAlert,
  //setOpenQRCode,
  //setCurrentSpool,
}) {
  console.count(">>CARD-ITEMS-CUSTOM");
  const { setOpenAlert, setOpenQRCode, setMessage, setCurrentSpool } =
    useQRCode();

  function normalizeAlphanumeric(text) {
    return text.replace(/[^A-Za-z0-9]/g, "").trim();
  }

  function formatCodeDefault(code) {
    // const result = code.replace(
    //   /^([A-Z]{2})(\d{4})(\d{5})(\d{4})$/,
    //   "$1-$2-$3-$4",
    // );
    // const result = code.replace(
    //   /^(?=.{15}$)([A-Z]{2})([A-Za-z0-9]{4})([A-Za-z0-9]{5})([A-Za-z0-9]{4,5})$/,
    //   (_, g1, g2, g3, g4) => `${g1}-${g2}-${g3}-${g4}`,
    // );
    // return result;
    const text = normalizeAlphanumeric(code);
    const match = text.match(/^(?=.{6,15}$)([A-Z]{2})([A-Za-z0-9]+)$/);
    if (!match) return null;

    const prefix = match[1];
    let rest = match[2];

    const groups = [prefix];

    if (rest.length >= 4) {
      groups.push(rest.slice(0, 4));
      rest = rest.slice(4);
    }

    if (rest.length >= 5) {
      groups.push(rest.slice(0, 5));
      rest = rest.slice(5);
    }

    if (rest.length >= 4) {
      const size = rest.length >= 5 ? 5 : 4;
      groups.push(rest.slice(0, size));
      rest = rest.slice(size);
    }

    if (rest.length > 0) {
      groups.push(rest);
    }

    return groups.join("-");
  }

  function formatDateCustom(date, time) {
    if (time?.trim().length === 0) {
      time = "00:00";
    }

    if (date?.trim().length > 0) {
      const dateFull = date.concat(" ").concat(time);
      const result = dateFull.replace(
        /(\d{4})(\d{2})(\d{2})\s(\d{2}:\d{2})/,
        "$3/$2/$1 às $4",
      );

      return result;
    }

    return "-- / -- / ---- às -- : --";
  }

  function formatSixDigits(value) {
    const result = String(value).padStart(4, "0");
    return result;
  }

  function getStyleStatus(sigle) {
    const statusStyle = {
      RE: () => {
        return "bg-amber-400 text-amber-100";
      },
      EX: () => {
        return "bg-teal-400 text-teal-100";
      },
      PU: () => {
        return "bg-orange-400 text-orange-100";
      },
      FI: () => {
        return "bg-green-500 text-green-100";
      },
      RV: () => {
        return "bg-lime-400 text-lime-100";
      },
      SU: () => {
        return "bg-red-400 text-red-100";
      },
      RO: () => {
        return "bg-sky-500 text-sky-100";
      },
    };

    const ex = statusStyle[sigle];

    return ex();
  }

  async function openModalQRCode(e, item) {
    e.preventDefault();
    if (item?.status_sigle === "SU" || item?.status_sigle === "RO") {
      setMessage(
        `Processo produção encerrado para esse SPOOL, selecione outro card.`,
      );
      setOpenAlert(true);
      return;
    }

    await setCurrentSpool(item);
    await setOpenQRCode(true);
  }

  if (items.length === 0) {
    return <Loading />;
  }

  return (
    <ul className="divide-y divide-stone-200 flex flex-col gap-4 py-2">
      <Separator />

      <div className="w-full border-2 border-stone-300 rounded-lg bg-stone-100 shadow-sm shadow-blue-500/50">
        <h3 className="text-md text-center font-semibold py-2">
          Clique no card para continuar
        </h3>
      </div>

      {items?.map((item, index) => (
        // <Fragment key={String(item?.codigo).concat(index)}>
        <li
          key={String(item?.codigo).concat(index)}
          className="hover:bg-stone-50 transition bg-white border-2 border-stone-200 rounded-lg shadow-lg"
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
                   w-full min-w-full rounded-md px-2 py-2 hover:bg-stone-100 hover:shadow-blue-600/50 hover:shadow-md
                   ${item?.status_sigle === "SU" || item?.status_sigle === "RO" ? "bg-stone-300/50 shadow-none text-stone-800" : "bg-transparent"}
                   `}
          >
            <div className="flex flex-row w-full justify-between px-2">
              <div className="flex flex-col  justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800  ">
                <small className="px-2 bg-stone-300/50 rounded-full w-fit">
                  {formatSixDigits(index + 1)}
                </small>
              </div>
              <div className="capitalize py-2 text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
                <span
                  className={`${String(getStyleStatus(item?.status_sigle))} p-1 text-xs rounded-full flex flex-row justify-center items-center`}
                >
                  <small> {item?.status}</small>
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-left px-2 py-2 text-xs sm:text-sm md:text-base">
                <strong>Código: </strong>
                {formatCodeDefault(item?.codigo)}
              </p>
              <div className="flex flex-row justify-between px-2 py-1">
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
                className=" px-2 py-2 text-xs sm:text-sm md:text-base text-left"
              >
                <small>
                  <strong>Descrição:</strong> {item?.descricao}
                </small>
              </p>
            </div>
          </Button>
        </li>
        // </Fragment>
      ))}
      <li className="rounded-md bg-stone-200 flex flex-row items-center px-4 py-2 mt-4">
        <p className="text-xs text-stone-600 font-bold tracking-wider flex flex-row gap-2">
          <span>{formatSixDigits(items?.length || 0)}</span>
          <span>TOTAL ITENS</span>
        </p>
      </li>
    </ul>
  );
}
