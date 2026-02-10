export default function Table({ items }) {
  return (
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
            Quantidade
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Corrida
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Fornecedor
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Descrição
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200">
        {items?.map((item, index) => (
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
            <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-zinc-800">
              {String(item?.quantidade).replace(".", ",")}
            </td>
            <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
              {item?.fluxo}
            </td>
            <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-zinc-800">
              {item?.fornecedor}
            </td>
            <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-zinc-800">
              {item?.descricao}
            </td>
          </tr>
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
