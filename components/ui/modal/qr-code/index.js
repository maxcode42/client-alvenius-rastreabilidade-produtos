import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

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

  const [result, setResult] = useState(null);

  function parseQrTextToJson(text) {
    return text
      ?.split("|")
      ?.map((part) => part.trim())
      ?.reduce((acc, item) => {
        const [key, ...valueParts] = item.split(":");
        if (!key || valueParts.length === 0) return acc;

        acc[key.trim().toUpperCase()] = valueParts.join(":").trim();
        return acc;
      }, {});
  }

  function parseQrSpoolToJson(text) {
    if (!text) return null;

    const match = text.trim().match(/^([A-Z]{2}-\d{4}-\d{5}-\d{3})\s+(.*)$/);

    if (!match) {
      throw new Error("Formato inválido do QR Code");
    }

    return {
      codigo: match[1],
      descricao: match[2],
    };
  }

  useEffect(() => {
    if (!isOpen) return;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" }, // câmera traseira
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // leitura contínua
          let parseJSON;
          setResult(decodedText);
          if (spool === null) {
            parseJSON = parseQrSpoolToJson(decodedText);

            setSpool(parseJSON);
            return;
          }

          if (spool !== null) {
            parseJSON = parseQrTextToJson(decodedText);
            console.log(parseJSON);
            const data = {
              quantidade: itens.length + 1,
              codigo: parseJSON.COD_FORNEC,
              fornecedor: parseJSON.COD_PRODUTO,
              fluxo: parseJSON.CORRIDA,
              descricao: parseJSON.DESC,
            };
            setItens([...itens, data]);
            return;
          }
        },
        () => {},
      )
      .catch(console.error);

    return () => {
      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch(() => {});
    };
  }, [isOpen, spool, itens, setItens, setSpool]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 ">
      {/* Header */}
      <div className="w-full max-w-md flex justify-center items-center p-4 text-white">
        <h2 className="text-lg font-semibold">Leitor de QRCode</h2>
      </div>

      <div className="flex flex-col border-2 border-stone-300/50 w-full" />
      {/* Camera */}
      <div className="bg-white rounded-lg p-2 py-4 mt-4">
        <div id={qrRegionId} className="w-[300px] h-[240px]" />
      </div>

      {/* Resultado */}
      <div className="mt-4 bg-white w-full max-w-md p-4 rounded">
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
                      <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Item
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Código
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {itens?.map((item, index) => (
                      <tr
                        key={item?.codigo + index}
                        className="hover:bg-zinc-50 transition odd:bg-white"
                      >
                        <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-zinc-800">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                          {item?.codigo}
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
                          {item?.descricao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col border-2 border-stone-300/50 w-full" />
        <div className="flex flex-col py-4">
          <p className="text-sm font-semibold">Último QRCode lido:</p>
          <p className="mt-2 text-xs break-all text-gray-700">
            {result ?? "Aguardando leitura..."}
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
    </div>
  );
}
