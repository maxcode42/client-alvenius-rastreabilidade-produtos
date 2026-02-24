import { Fragment } from "react";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  Loader2Icon,
  RefreshCcwDotIcon,
  SettingsIcon,
} from "lucide-react";

import Button from "components/ui/button";

export default function ListFlow({ items, setOpenQRCode, setText }) {
  //console.log(titles);
  //const [expandItem, setExpandItem] = useState(false);
  //const [expandItemIndex, setExpandItemIndex] = useState(null);
  // function onExpandDetails(e, index) {
  //   e.preventDefault();
  //   //setExpandItem(!expandItem && String(expandItemIndex) !== String(index));

  //   setExpandItemIndex((prev) =>
  //     String(prev) === String(index) ? null : index,
  //   );
  //   //setExpandItem(action);

  //   // if (String(expandItemIndex) === String(index)) {
  //   //   setExpandItem(true);
  //   // }
  // }

  // useEffect(() => {}, [expandItemIndex]);

  function formatCodeDefault(code) {
    const result = code.replace(
      /^([A-Z]{2})(\d{4})(\d{5})(\d{3})$/,
      "$1-$2-$3-$4",
    );
    return result;
  }

  function formatDateCustom(date, time) {
    if (date.length > 0) {
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

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full min-h-72">
        <Loader2Icon className="size-28 animate-spin text-stone-300" />
        <p className="text-stone-300 text-xs md:text-sm animate-pulse w-full flex flex-col justify-center items-center">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-stone-200 flex flex-col gap-4 px-2 py-2">
        {items?.map((item, index) => (
          <Fragment key={String(item?.codigo).concat(index)}>
            <li className="hover:bg-stone-50 transition odd:bg-white px-2 py-2 border-2 border-stone-200 rounded-lg shadow-lg">
              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row justify-center gap-1">
                  <div className="flex flex-col  justify-center items-center text-sm sm:text-sm md:text-base text-center text-stone-800  ">
                    <small className="px-2 bg-stone-300/50 rounded-full w-fit">
                      {formatSixDigits(index + 1)}
                    </small>
                  </div>
                  {/* <div className="w-1/4 max-w-16 text-center px-4 py-3 text-xs sm:text-sm md:text-base text-stone-800">
                  <Button
                    type="button"
                    title="Expandir detalhes"
                    onClick={(e) =>
                      onExpandDetails(e, String(item?.codigo).concat(index))
                    }
                    className={`
                    ${
                      String(expandItemIndex) ===
                      String(item?.codigo).concat(index)
                        ? "border-stone-600/50"
                        : "border-blue-600/50"
                    }
                    truncate border-2 min-w-10 w-full py-1 rounded-sm text-center flex flex-row gap-2 justify-center items-center text-blue-600 hover:text-stone-100`}
                  >
                    {String(expandItemIndex) ===
                    String(item?.codigo).concat(index) ? (
                      <EyeOffIcon className="size-4 text-stone-300" />
                    ) : (
                      <EyeIcon className="size-4 text-blue-600" />
                    )}
                  </Button>
                </div> */}
                  <p className="flex flex-row justify-center items-center gap-1 px-2 py-2 text-xs sm:text-sm md:text-base text-stone-800">
                    <strong>Código: </strong>
                    {formatCodeDefault(item?.codigo)}
                  </p>
                </div>
                <div className="capitalize px-2 py-2 text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
                  <span
                    className={`${String(getStyleStatus(item?.status_sigla))} p-1 text-xs  rounded-full flex flex-row justify-center items-center`}
                  >
                    <small> {item?.status}</small>
                  </span>
                </div>
              </div>
              <div>
                <div className="flex flex-row justify-between px-2 py-1">
                  <p className="text-xs flex flex-col w-1/2 gap-1">
                    <small className="flex flex-row gap-1">
                      <CalendarDaysIcon className="size-4 text-slate-400" />
                      <strong>Início:</strong>
                    </small>
                    <small>
                      {formatDateCustom(item.dateStart, item.timeStart)}
                    </small>
                  </p>
                  <div className="flex flex-col items-center justify-center bg-stone-200 w-[.2rem] h-8 rounded-full" />
                  <p className="text-xs flex flex-col w-1/2 px-4 gap-1">
                    <small className="flex flex-row gap-1">
                      <CalendarDaysIcon className="size-4 text-stone-400" />
                      <strong>Finalizado:</strong>{" "}
                    </small>
                    <small>
                      {formatDateCustom(item.dateEnd, item.timeEnd)}
                    </small>
                  </p>
                </div>
                <p
                  colSpan={5}
                  className=" px-2 py-2 text-xs sm:text-sm md:text-base text-stone-800"
                >
                  <small>
                    <strong>Descrição:</strong> {item?.descricao}
                  </small>
                </p>
              </div>
              <div className="flex flex-row w-full gap-1">
                <div className="w-1/3">
                  <Button
                    type="button"
                    title="Incia processo produção"
                    onClick={() => (setOpenQRCode(true), setText("INICIAR"))}
                    className="truncate w-full min-w-20 text-xs py-2 px-1 rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
                  >
                    <SettingsIcon className="size-4" />
                    <span className="text-xs sm:text-base truncate">
                      Iniciar
                    </span>
                  </Button>
                </div>
                <div className="w-1/3 truncate sm:text-sm md:text-base text-stone-800">
                  <Button
                    type="button"
                    title="Finaliza processo produção"
                    onClick={() => (setOpenQRCode(true), setText("FINALIZAR"))}
                    className="truncate w-full min-w-20 py-2 px-1 text-xs rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-blue-100 hover:shadow-green-600 hover:shadow-md"
                  >
                    <CheckCircleIcon className="size-4" />
                    <span className="text-xs sm:text-base truncate">
                      Finalizar
                    </span>
                  </Button>
                </div>
                <div className="w-1/3 ">
                  <Button
                    type="button"
                    title="Avaliar qualidade produto"
                    onClick={() => (setOpenQRCode(true), setText("Qualidade"))}
                    className="truncate w-full  min-w-20 py-2 px-1 text-xs rounded-sm text-center flex flex-row gap-1 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
                  >
                    <RefreshCcwDotIcon className="size-4" />
                    <span className="text-xs sm:text-base truncate">
                      Aprova CQ
                    </span>
                  </Button>
                </div>
              </div>
            </li>
            {/* {String(expandItemIndex) === String(item?.codigo).concat(index) && (
              <li
                className={`hover:bg-stone-50 odd:bg-white border-none transform transition-all duration-300 ease-in-out
                 ${
                   String(expandItemIndex) ===
                   String(item?.codigo).concat(index)
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 -translate-y-2 pointer-events-none"
                 }
              `}
              >
                <li
                  colSpan={5}
                  className="truncate border-t-2 border-stone-200 px-4 py-3 text-xs sm:text-sm md:text-base text-stone-800"
                >
                  <strong>Descrição:</strong> {item?.descricao}
                </li>
              </li>
            )} */}
          </Fragment>
        ))}
      </ul>
      <div>
        <ul className="bg-stone-200 flex flex-row items-center px-2 mt-4">
          <span className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            {formatSixDigits(items?.length) || 0}
          </span>
          <span
            colSpan={6}
            className=" px-2 py-3 text-left text-xs font-bold uppercase tracking-wider text-stone-600"
          >
            TOTAL ITENS
          </span>
          {/* <td
            colSpan={6}
            className="max-w-16 px-2 py-3 text-left text-xs font-bold uppercase tracking-wider text-stone-600"
          >
            TOTAL ITENS
          </li> */}
        </ul>
      </div>
    </div>
  );
}
