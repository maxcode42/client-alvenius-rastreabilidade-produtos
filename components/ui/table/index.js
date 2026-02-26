export default function Table({ titles, items }) {
  return (
    <table className="text-sm w-full min-w-full border border-stone-200 bg-white rounded-lg">
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
      <tbody className="divide-y divide-stone-200">
        {items?.map((item, index) => (
          <tr
            key={item?.codigo + index}
            className="hover:bg-stone-50 transition odd:bg-white"
          >
            <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-stone-800">
              {index + 1}
            </td>
            <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-stone-800">
              {item?.codigo}
            </td>
            {item?.quantidade && (
              <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-stone-800">
                {String(item?.quantidade).replace(".", ",")}
              </td>
            )}
            {item?.fluxo && (
              <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-stone-800">
                {item?.fluxo}
              </td>
            )}
            {item?.fornecedor && (
              <td className="px-4 py-3 text-xs sm:text-sm md:text-base text-center text-stone-800">
                {item?.fornecedor}
              </td>
            )}
            <td className="truncate px-4 py-3 text-xs sm:text-sm md:text-base text-stone-800">
              {item?.descricao}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className={items?.length === 0 && "hidden"}>
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
