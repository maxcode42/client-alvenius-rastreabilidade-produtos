import { useEffect } from "react";
import { Trash2Icon, CircleQuestionMarkIcon } from "lucide-react";

import QRCodeBase from "../qr-code-base";
import Input from "components/ui/input";
import Button from "components/ui/button";
import Separator from "components/ui/separator";

import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeTransfer({ data, setData, suppliers }) {
  const { setCurrentSpool, setSpool, spool } = useQRCode();

  function removeItem(e, index) {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      spools: prev.spools.filter((_, i) => i !== index),
    }));
  }

  useEffect(() => {
    console.log(spool);
    if (!spool) return;

    setData((prev) => ({
      ...prev,
      spools: [...(prev?.spools || []), spool?.codigo],
    }));
    setCurrentSpool(null);
    setSpool(null);
    // }, [spool, currentSpool]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spool]);

  // CONFIMAR A NECESSIDADE DO USEEFFECT
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <QRCodeBase>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-center">
          Ler QRCode do Spool.
        </h2>
        <p className="text-sm font-semibold">1 - Selecione realizador.</p>
        <p className="text-sm font-semibold">2 - Selecione o fornecedor.</p>
        <p className="text-sm font-semibold ">
          3 - Ler o QRCode do Spool para serviço.
        </p>
        {/* SC - AET - */}
      </div>

      <Separator />

      <div className="flex flex-col">
        <div className={`flex flex-col justify-center gap-1 py-4`}>
          <label className="w-full flex flex-row item-center gap-2">
            <CircleQuestionMarkIcon
              className="text-stone-400 mr-2 mt-0.5"
              size={18}
            />
            Serviço realizado por?
          </label>
          <div className="flex flex-row justify-around">
            <Input
              label="Alvenius"
              type="radio"
              id="third-false"
              name="third"
              value={false}
              checked={!data?.third}
              onChange={() => setData({ ...data, third: false })}
              className={`px-0 py-0 border-none`}
            />
            <Input
              label="Terceiro"
              type="radio"
              id="third-true"
              name="third"
              value={true}
              checked={data?.third}
              // disabled={!data?.third}
              onChange={() => setData({ ...data, third: true })}
              className={`px-0 py-0 border-none`}
            />
          </div>
        </div>

        <Separator className={"via-stone-300/50"} />

        <section
          className={`w-full flex flex-col w-full mt-4 mb-4 
           
            `}
        >
          <label className={`${!data.third ? "disabled text-stone-400" : ""}`}>
            Origem Terceiro:
          </label>
          <select
            className={`py-4
            rounded-md text-lg 
            bg-transparent px-3 py-4 outline-none 
            border-2 border-stone-300/50 placeholder:text-gray-400 
            focus:border-blue-600/50 focus:ring-0 focus:ring-blue-200 
            focus:shadow-md focus:shadow-blue-300/50 w-full
             ${!data.third ? "disabled text-stone-400" : ""}
            `}
            onChange={(e) =>
              setData({
                ...data,
                supplier_origin: suppliers?.origin?.find(
                  (f) => f.code === e.target.value,
                ),
              })
            }
            disabled={!data?.third}
          >
            <option className="">Selecione...</option>
            {suppliers?.origin?.map((item) => (
              <option
                className="max-w-xs truncate"
                value={item?.code}
                key={item?.code}
              >
                {item?.code} - {item?.store} -{" "}
                {item?.name?.trimStart().trimEnd()}
              </option>
            ))}
          </select>
        </section>

        <section className="w-full flex flex-col w-full mt-4 mb-4">
          <label>Destino Fornecedor:</label>
          <select
            className="py-4
            rounded-md text-lg 
            bg-transparent px-3 py-4 outline-none 
            border-2 border-stone-300/50 placeholder:text-gray-400 
            focus:border-blue-600/50 focus:ring-0 focus:ring-blue-200 
            focus:shadow-md focus:shadow-blue-300/50 w-full"
            onChange={(e) =>
              setData({
                ...data,
                supplier_destination: suppliers?.destination?.find(
                  (f) => f.code === e.target.value,
                ),
              })
            }
          >
            <option className="">Selecione...</option>
            {suppliers?.destination?.map((item) => (
              <option
                className="max-w-xs truncate"
                value={item?.code}
                key={item?.code}
              >
                {item?.code} - {item?.store} -{" "}
                {item?.name?.trimStart().trimEnd()}
              </option>
            ))}
          </select>
        </section>
        <Separator className={"via-stone-300/50"} />

        <div className="flex flex-col py-4 mb-4">
          <p className="text-md sm:text-lg break-all font-bold">Spools</p>
          <div className="flex flex-col ">
            <table className="text-sm w-full min-w-full border border-zinc-200 bg-white rounded-lg">
              <thead>
                <tr className="bg-stone-200">
                  <th className="max-w-8 px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                    Itens
                  </th>
                  <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                    Código
                  </th>
                  <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {data?.spools?.map((item, index) => (
                  <tr
                    key={item.concat(index)}
                    className="hover:bg-zinc-50 transition odd:bg-white"
                  >
                    <td className="max-w-8 px-1 py-1 text-xs sm:text-sm md:text-base text-center text-zinc-800">
                      {index + 1}
                    </td>
                    <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-zinc-800">
                      {item}
                    </td>
                    <td className="max-w-6 px-1 py-1 text-xs sm:text-sm md:text-base text-zinc-800">
                      <Button
                        type="button"
                        onClick={(e) => removeItem(e, index)}
                        className="bg-transparent px-4 py-1 w-4 h-full flex flex-col items-center justify-center hover:bg-transparent border-none hover:shadow-none focus:none"
                      >
                        <Trash2Icon className="size-4 text-red-600/50 hover:text-red-800" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </QRCodeBase>
  );
}
