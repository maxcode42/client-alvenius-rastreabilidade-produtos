export default function Table({ items }) {
  return (
    <table className="text-sm w-full min-w-full border border-stone-200 bg-white rounded-lg">
      <thead>
        <tr className="bg-stone-200">
          <th
            colSpan={4}
            className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600 border-b-[.1rem] border-stone-100"
          >
            Componentes
          </th>
        </tr>
        <tr className="bg-stone-200">
          <th
            colSpan={2}
            className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600"
          >
            Itens
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Descrição
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            QTD.
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200">
        {items?.map((item, index) => (
          <tr
            key={item?.codigo + index}
            className="hover:bg-stone-50 transition odd:bg-white"
          >
            <td className="px-1 py-1 max-w-4 text-xs sm:text-sm md:text-base text-center text-stone-800">
              {index + 1}
            </td>
            <td className="min-w-14 tracking-wider px-1 py-1 text-xs sm:text-sm md:text-base text-stone-800">
              <small className="flex flex-col justify-center">
                <span className="flex flex-row gap-1 items-center">
                  <strong>Código:</strong> {item?.codigo}
                </span>
                <span className="flex flex-row gap-1 items-center">
                  <strong>Fornecedor:</strong> {item?.fornecedor}
                </span>
                <span className="flex flex-row gap-1 items-center">
                  <strong>Corrida:</strong> {item?.fluxo}
                </span>
              </small>
            </td>
            <td className="tracking-wider px-1 py-1 text-xs sm:text-sm md:text-base text-stone-800">
              <span>{item?.descricao}</span>
            </td>
            {item?.quantidade && (
              <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-center text-stone-800">
                {String(item?.quantidade).replace(".", ",")}
              </td>
            )}
          </tr>
        ))}
      </tbody>
      <tfoot className={items?.length === 0 ? "hidden" : ""}>
        <tr className="bg-stone-200">
          <td className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            {items?.length || 0}
          </td>
          <td
            colSpan={4}
            className="px-2 py-3 text-left text-xs font-bold uppercase tracking-wider text-stone-600"
          >
            TOTAL ITENS
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
