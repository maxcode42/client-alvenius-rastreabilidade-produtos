import { Fragment } from "react";

import { CheckCircleIcon, RefreshCcwDotIcon, SettingsIcon } from "lucide-react";

import Button from "components/ui/button";

export default function ListFlow({ titles, items, setOpenQRCode, setText }) {
  console.log(titles);
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

  return (
    <div>
      <ul className="divide-y divide-stone-200 flex flex-col gap-4 px-2 py-2">
        {items?.map((item, index) => (
          <Fragment key={String(item?.codigo).concat(index)}>
            <li className="hover:bg-stone-50 transition odd:bg-white px-2 py-2 border-2 border-stone-200 rounded-lg shadow-lg">
              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row justify-center gap-1">
                  <div className="flex flex-col px-4 py-2 justify-center items-center text-base sm:text-sm md:text-base text-center text-stone-800 bg-stone-300/50 rounded-full w-fit ">
                    <small> {index + 1}</small>
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
                    {item?.codigo}
                  </p>
                </div>
                <div className="capitalize px-2 py-2 text-center min-w-20 text-xs sm:text-sm md:text-base text-stone-800">
                  <span
                    className={`
                  ${String(item?.status).toLowerCase() === "reservado" && "bg-yellow-400"}
                  ${String(item?.status).toLowerCase() === "execução" && "bg-blue-400"}
                  ${String(item?.status).toLowerCase() === "finalizado" && "bg-green-400"}
                  ${String(item?.status).toLowerCase() === "sucata" && "bg-red-400"}
                  p-1 text-xs  rounded-full flex flex-row justify-center items-center text-stone-100`}
                  >
                    <small> {item?.status}</small>
                  </span>
                </div>
              </div>
              <div>
                <p
                  colSpan={5}
                  className=" px-2 py-2 text-xs sm:text-sm md:text-base text-stone-800"
                >
                  <strong>Descrição:</strong> {item?.descricao}
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
            {items?.length || 0}
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
