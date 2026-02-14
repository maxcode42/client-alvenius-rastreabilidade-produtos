import { useEffect, useState } from "react";

import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshCcwDotIcon,
  SettingsIcon,
} from "lucide-react";

import Button from "components/ui/button";

export default function TableFlow({ titles, items }) {
  //const [expandItem, setExpandItem] = useState(false);
  const [expandItemIndex, setExpandItemIndex] = useState(null);
  function onExpandDetails(e, index) {
    e.preventDefault();
    //setExpandItem(!expandItem && String(expandItemIndex) !== String(index));

    setExpandItemIndex((prev) =>
      String(prev) === String(index) ? null : index,
    );
    //setExpandItem(action);

    // if (String(expandItemIndex) === String(index)) {
    //   setExpandItem(true);
    // }
  }

  useEffect(() => {}, [expandItemIndex]);

  return (
    <table className="text-sm w-full min-w-full border border-zinc-200 bg-white rounded-lg">
      <thead>
        <tr className="bg-stone-200">
          {titles.map((title) => (
            <th
              key={title}
              className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600"
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200">
        {items?.map((item, index) => (
          <>
            <tr
              key={String(item?.codigo).concat(index)}
              className="hover:bg-zinc-50 transition odd:bg-white"
            >
              <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-zinc-800">
                {index + 1}
              </td>
              <td className="max-w-16 text-center px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
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
                    truncate border-2 min-w-10    w-full py-1 rounded-sm text-center flex flex-row gap-2 justify-center items-center text-blue-600 hover:text-stone-100`}
                >
                  {String(expandItemIndex) ===
                  String(item?.codigo).concat(index) ? (
                    <EyeOffIcon className="size-4 text-stone-300" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </Button>
              </td>
              <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                {item?.codigo}
              </td>
              <td className="capitalize px-4 py-3 text-center text-xs sm:text-sm md:text-base text-zinc-800">
                <span
                  className={`
                  ${String(item?.status).toLowerCase() === "reservado" && "bg-yellow-400"}
                  ${String(item?.status).toLowerCase() === "execução" && "bg-red-400"}
                  ${String(item?.status).toLowerCase() === "finalizado" && "bg-green-400"}
                  p-1 text-xs  rounded-full flex flex-row justify-center items-center text-stone-100`}
                >
                  <small> {item?.status}</small>
                </span>
              </td>

              <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                <Button
                  type="button"
                  title="Executar produto está conforme"
                  className="truncate w-full min-w-24 py-2 px-2 rounded-sm text-center flex flex-row gap-2 justify-center items-center bg-yellow-500 text-blue-100  hover:bg-yellow-800 hover:text-blue-100 hover:shadow-yellow-600 hover:shadow-md"
                >
                  <SettingsIcon className="size-4" />
                  <span className="text-sm sm:text-base truncate">Iniciar</span>
                </Button>
              </td>
              <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                <Button
                  type="button"
                  title="Executar produto está conforme"
                  className="truncate w-full py-2 px-2 rounded-sm text-center flex flex-row gap-2 justify-center items-center bg-green-500 text-blue-100  hover:bg-green-800 hover:text-blue-100 hover:shadow-green-600 hover:shadow-md"
                >
                  <CheckCircleIcon className="size-4" />
                  <span className="text-sm sm:text-base truncate">
                    Finalizar
                  </span>
                </Button>
              </td>
              <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                <Button
                  type="button"
                  title="Executar produto está conforme"
                  className="truncate w-full py-2 px-2 rounded-sm text-center flex flex-row gap-2 justify-center items-center bg-blue-500 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
                >
                  <RefreshCcwDotIcon className="size-4" />
                  <span className="text-sm sm:text-base truncate">
                    Aprova CQ
                  </span>
                </Button>
              </td>
            </tr>
            {String(expandItemIndex) === String(item?.codigo).concat(index) && (
              <tr
                className={`border-none transform transition-all duration-300 ease-in-out
                 ${
                   String(expandItemIndex) ===
                   String(item?.codigo).concat(index)
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 -translate-y-2 pointer-events-none"
                 }
              `}
              >
                <td></td>
                <td
                  colSpan={5}
                  className="truncate border-t-2 border-stone-200 px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800"
                >
                  <strong>Descrição:</strong> {item?.descricao}
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-stone-200">
          <td className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            {items?.length || 0}
          </td>
          <td></td>
          <td className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600"></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  );
}
