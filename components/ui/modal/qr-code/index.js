import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trash2Icon, RulerDimensionLineIcon } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

import Input from "../../input";
import AlertInfo from "components/ui/alert/info";

export default function QRCode({
  isOpen,
  onClose,
  itens,
  setItens,
  spool,
  setSpool,
}) {
  const qrRegionId = "qr-reader";
  const qrCodeRef = useRef(null);

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const [amount, setAmount] = useState(1);
  const [amountMessage, setAmountMessage] = useState("");
  const [pendingItem, setPendingItem] = useState(null);
  const [scannerLocked, setScannerLocked] = useState(false);
  const [openAmountForm, setOpenAmountForm] = useState(false);

  const productsTypes = useMemo(
    () => ["TB", "TJ", "TK", "TU", "TV", "TW", "TI"],
    [],
  );

  function normalizedText(text) {
    return new TextDecoder("utf-8")
      .decode(new TextEncoder().encode(text))
      .normalize("NFC");
  }

  const parseQrSpoolToJson = useCallback((text) => {
    const normalized = normalizedText(text);
    //const match = text.trim().match(/^([A-Z]{2}-\d{4}-\d{5}-\d{3})\s+(.*)$/);
    const match = normalized
      .trim()
      .match(/^(SP-[A-Za-z0-9]{4}-[A-Za-z0-9]{5}-[A-Za-z0-9]{3})\s+(.*)$/);
    if (!match) {
      setMessage(
        "Escanear primeiro o QRCode do SPOOL, ou este QRCODE é inválido!",
      );
      setOpenAlert(true);
      return null;
    }
    return { codigo: match[1], descricao: match[2] };
  }, []);

  function normalizeDelimiter(text) {
    return text.replace(/(?<=\s)[I|](?=\s)/g, "|");
  }

  const parseQrTextToJson = useCallback((text) => {
    const normalized = normalizedText(text);

    const textNormalized = normalizeDelimiter(normalized);

    const obj = textNormalized
      .split("|")
      .map((p) => p.trim())
      .reduce((acc, item) => {
        const [k, ...v] = item.split(":");
        if (k && v.length) acc[k.trim().toUpperCase()] = v.join(":").trim();
        return acc;
      }, {});

    if (!obj.COD_PRODUTO) {
      setMessage("QRCode de COMPONENTE inválido");
      setOpenAlert(true);
      return null;
    }
    return obj;
  }, []);

  const checkIfItContainsProductType = useCallback(
    (codigo) => {
      return productsTypes.some((t) => codigo.includes(t));
    },
    [productsTypes],
  );

  const handleChangeAmount = (e) => {
    console.log(e.target.value);
    //let input = e.target.value;

    // Remove caracteres inválidos

    //let digits = e.target.value.replace(/\D/g, ""); // só números

    // Garante apenas um separador
    // const parts = digits.split(/[.,]/);

    // if (parts.length > 6) {
    //   digits = parts.slice(0, 6);
    // }

    // if (digits.length <= 3) {
    //   setAmount(digits);
    // } else {
    //   const before = digits.slice(0, 3);
    //   const after = digits.slice(3);

    //   setAmount(`${before},${after}`);
    // }
    let input = e.target.value;

    // converte ponto para vírgula
    input = input.replace(/\./g, ",");

    // remove caracteres inválidos
    input = input.replace(/[^\d,]/g, "");

    // impede mais de uma vírgula
    const parts = input.split(",");
    if (parts.length > 2) return;

    // limita inteiros a 3 dígitos
    if (parts[0].length > 3) return;

    // limita decimais a 3 dígitos
    if (parts[1] && parts[1].length > 3) return;

    setAmount(input);
  };

  function isValidAmount(value) {
    //return /^\d{1,3}([,.]\d{1,3})?$/.test(value);
    return /^(\d{0,3})([.,]?)(\d{0,3})/.test(value);
  }

  function resetAmountForm() {
    setAmount(1);
    setAmountMessage("");
    setPendingItem(null);
    setOpenAmountForm(false);
    setScannerLocked(false);
  }

  const handleConfirmAmount = (e) => {
    e.preventDefault();

    if (!pendingItem) return;

    if (!isValidAmount(amount)) {
      setAmountMessage("Formato inválido. Ex: 123,456");
      return;
    }

    // const numericAmount = parseFloat(String(amount).replace(",", ".")).toFixed(
    //   3,
    // );

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

  const handleQrDecoded = useCallback(
    (decodedText) => {
      if (scannerLocked) return;

      setResult(decodedText);
      setScannerLocked(true);

      if (!spool) {
        const parsedSpool = parseQrSpoolToJson(decodedText);
        if (parsedSpool) setSpool(parsedSpool);
        setScannerLocked(false);
        return;
      }

      const parsed = parseQrTextToJson(decodedText);

      if (!parsed) return;

      const baseItem = {
        codigo: parsed?.COD_PRODUTO,
        fornecedor: parsed?.COD_FORNEC,
        fluxo: parsed?.CORRIDA,
        descricao: parsed?.DESC,
        quantidade: 1,
      };

      if (checkIfItContainsProductType(parsed.COD_PRODUTO)) {
        setPendingItem(baseItem);

        setOpenAmountForm(true);
        return;
      }
      setMessage(`Componente: ${baseItem.codigo} - ${baseItem.descricao}`);
      setOpenAlert(true);

      setItens((prev) => [...prev, baseItem]);
    },
    [
      scannerLocked,
      checkIfItContainsProductType,
      parseQrSpoolToJson,
      parseQrTextToJson,
      setItens,
      setSpool,
      spool,
    ],
  );

  useEffect(() => {
    if (!isOpen) return;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeRef.current = html5QrCode;

    // html5QrCode.start(
    //   { facingMode: "environment" },
    //   { fps: 10, qrbox: { width: 250, height: 250 } },
    //   handleQrDecoded,
    // );
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 20,
        aspectRatio: 1.0,
        //qrbox: undefined, // importante
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.8;
          return { width: size, height: size };
        },
      },
      handleQrDecoded,
    );

    return () => {
      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch(() => {
          console.log("Error: Falha ao ler QRCODE");
        });
    };
  }, [isOpen, handleQrDecoded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 pb-16 sm:pb-0 ">
      {/* Header */}
      <div className="w-full max-w-md flex justify-center items-center p-4 text-white">
        <h2 className="text-lg font-semibold">Leitor de QRCode</h2>
      </div>

      <div className="flex flex-col border-2 border-stone-300/50 w-full" />
      {/* Camera */}
      <div className="bg-white rounded-md p-2 py-4 mt-4 w-full max-w-md aspect-square relative">
        {/* <div id={qrRegionId} className="w-[300px] h-[240px]" /> */}
        <div id={qrRegionId} className="w-full h-full" />
      </div>

      {/* Resultado */}
      <div className="mt-4 bg-white w-full max-w-md p-4 rounded-md">
        <div className="flex flex-col py-2">
          <p className="text-sm font-semibold">1 - Ler o QRCode do Spool.</p>
          <p className="text-sm font-semibold">
            2 - Ler o QRCode dos componentes.
          </p>
        </div>
        <div className="flex flex-col border-2 border-stone-300/50 w-full" />
        {spool && (
          <div className="flex flex-col py-4">
            <p className="mt-2 text-md break-all ">Spool:</p>
            <div className="text-xs sm:text-lg">
              <div className="flex flex-col ">
                <p>
                  <span className="font-semibold">Código: </span>
                  <span className="font-normal">{spool?.codigo}</span>
                </p>
                <p>
                  <span className="font-semibold">Descrição: </span>
                  <span className="font-normal truncate">
                    {spool?.descricao}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col py-4">
              <p className="mt-2 text-md break-all ">Componentes:</p>
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
                          <button
                            type="button"
                            onClick={(e) => removeItem(e, item?.codigo + index)}
                            className="px-4 py-1 w-4 h-full flex flex-col items-center justify-center"
                          >
                            <Trash2Icon className="size-4 text-red-600/50" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col border-2 border-stone-300/50 w-full" />
          </div>
        )}
        <div className="flex flex-col py-4">
          <p className="text-sm font-semibold">Último QRCode lido:</p>
          <p className="mt-2 text-xs break-all text-gray-700">
            {result ?? (
              <span className="animate-pulse">Aguardando leitura...</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full h-full py-8 sm:w-1/4">
        <button
          onClick={onClose}
          className="text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Fechar
        </button>
      </div>

      {/* Alert */}
      <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={setScannerLocked}
      />

      {/* Form */}
      {openAmountForm && (
        <div
          className={`
          absolute top-0 z-40 h-full flex flex-col items-center justify-center
          bg-blue-950/50 w-full gap-2 px-4 
          transform transition-all duration-300 ease-in-out
          ${
            openAmountForm
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
          `}
        >
          <div className="w-full max-w-md bg-stone-100 border-2 border-950/50 rounded-md flex flex-col justify-center items-center p-4">
            <section className="w-full px-4 py-4 border-b-2 border-950/50">
              <h3 className="text-2xl text-center">Quantidade componente</h3>
            </section>
            <section className="w-full px-4 py-16">
              <form className="flex flex-col w-full sm:w-1/2 lg:w-1/3 p-4 gap-8 justify-center border-blue-950/50 border-2 rounded-sm">
                <section className="flex flex-col w-full items-center gap-4">
                  <p className="text-sm">Digite o comprimento do componente.</p>
                </section>
                <section className="flex flex-col w-full gap-4">
                  <div className="flex flex-col">
                    <Input
                      id="qtd"
                      type="text"
                      inputModel="decimal"
                      value={amount}
                      label="Qual medida do tubo:"
                      placeholder="000,000"
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   if (/^\d{1,3}([,.]\d{1,3})?$/.test(value)) {
                      //     setAmount(value);
                      //   }
                      // }}
                      onChange={handleChangeAmount}
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
            </section>
            <section className="w-full px-4 py-4 border-t-2 border-950/50">
              <div className="flex flex-row gap-4 w-full h-full py-4">
                <button
                  onClick={(e) => handleCancelAmount(e)}
                  className="w-1/2 text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => handleConfirmAmount(e)}
                  className="w-1/2 text-sm bg-blue-600 px-3 py-1 rounded-md text-stone-100 h-16"
                >
                  Confirmar
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
