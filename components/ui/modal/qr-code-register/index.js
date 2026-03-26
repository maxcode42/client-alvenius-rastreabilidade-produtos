import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Trash2Icon, RulerDimensionLineIcon } from "lucide-react";

import QRCodeBase from "../qr-code-base";
import Input from "components/ui/input";
import Button from "components/ui/button";
import AlertCustom from "components/ui/alert";
import Separator from "components/ui/separator";
import TextSpool from "components/ui/text-spool";

import { isValidAmount } from "util/regex/amount";
import { handleChangeAmount } from "util/formatters/amount";

import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeRegister() {
  const {
    setPendingItem,
    setOpenAlert,
    pendingItem,
    setMessage,
    setItens,
    itens,
    spool,
  } = useQRCode();

  const [amount, setAmount] = useState(1.0);
  const [amountMessage, setAmountMessage] = useState("");
  const [openAmountForm, setOpenAmountForm] = useState(false);

  const processingRef = useRef(false);

  const resetAmountForm = () => {
    setAmount(1.0);
    setPendingItem(null);
    setAmountMessage("");

    processingRef.current = false;
    setOpenAmountForm(false);
  };

  const handleConfirmAmount = (e) => {
    e.preventDefault();

    if (!pendingItem) return;

    if (!isValidAmount(amount)) {
      setAmountMessage("Formato inválido. Ex: 123,456");
      return;
    }

    setItens((prev) => [...prev, { ...pendingItem, quantidade: amount }]);

    resetAmountForm();
  };

  const handleCancelAmount = (e) => {
    e.preventDefault();
    resetAmountForm();
  };

  function removeItem(e, codigo) {
    e.preventDefault();
    setItens((prev) =>
      prev.filter((item, index) => item.codigo + index !== codigo),
    );
  }

  const fnOpenAmountForm = useCallback(() => {
    processingRef.current = true;
    setOpenAmountForm(true);
    setOpenAlert(true);
    setMessage("");
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!spool) return;
    // }, [spool, currentSpool]);
  }, [spool]);

  useEffect(() => {
    if (!pendingItem) return;

    fnOpenAmountForm();
  }, [pendingItem, fnOpenAmountForm]);

  return (
    <Fragment>
      <QRCodeBase>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-center">
            Ler o QRCode do Spool e Componentes.
          </h2>
          <p className="text-sm font-semibold">1 - Ler o QRCode do Spool.</p>
          <p className="text-sm font-semibold">
            2 - Ler o QRCode dos componentes.
          </p>
        </div>

        <Separator />

        {spool && (
          <div className="flex flex-col py-5">
            <TextSpool spool={spool} />

            <div className="flex flex-col py-4 mb-4">
              <p className="text-md sm:text-lg break-all font-bold">
                Componentes
              </p>
              <div className="flex flex-col ">
                <table className="text-sm w-full min-w-full border border-zinc-200 bg-white rounded-lg">
                  <thead>
                    <tr className="bg-stone-200">
                      <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Item
                      </th>
                      <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Código
                      </th>
                      <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Descrição
                      </th>
                      <th className="px-1 py-1 text-center text-xs font-bold uppercase tracking-wider text-stone-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {itens?.map((item, index) => (
                      <tr
                        key={item?.codigo + index}
                        className="hover:bg-zinc-50 transition odd:bg-white"
                      >
                        <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-center text-zinc-800">
                          {index + 1}
                        </td>
                        <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-zinc-800">
                          {item?.codigo}
                        </td>
                        <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-zinc-800">
                          {item?.descricao}
                        </td>
                        <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-zinc-800">
                          <Button
                            type="button"
                            onClick={(e) => removeItem(e, item?.codigo + index)}
                            className="bg-transparent px-4 py-1 w-4 h-full flex flex-col items-center justify-center"
                          >
                            <Trash2Icon className="size-4 text-red-600/50" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </QRCodeBase>

      {openAmountForm && (
        <AlertCustom
          action={handleConfirmAmount}
          actionClose={handleCancelAmount}
          title="Quantidade componente"
          type="form"
        >
          <form className="flex flex-col w-full p-4 gap-8 justify-center border-blue-950/50 border-2 rounded-sm">
            <section className="flex flex-col w-full items-center gap-4">
              <p className="text-sm">Digite o comprimento do componente.</p>
            </section>
            <section className="flex flex-col w-full gap-4">
              <div className="flex flex-col">
                <Input
                  id="qtd"
                  type="text"
                  value={amount}
                  placeholder="000,000"
                  label="Medida do tubo em metros:"
                  onChange={(e) => setAmount(handleChangeAmount(e))}
                >
                  <RulerDimensionLineIcon
                    className="text-stone-400 mr-2"
                    size={18}
                  />
                </Input>
                <span
                  className={`py-1 h-7 min-h-7 text-sm text-red-500 transition-all ${amountMessage.length > 0 ? "" : "hidden translate-y-9"}`}
                >
                  {"* "}
                  {amountMessage}
                </span>
              </div>
            </section>
          </form>
        </AlertCustom>
      )}
    </Fragment>
  );
}
