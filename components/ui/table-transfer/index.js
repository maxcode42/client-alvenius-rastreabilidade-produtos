export default function TableTransfer({ items }) {
  // if (!items || items.length === 0) return null;

  return (
    <table className="text-sm w-full min-w-full min-h-[30vh] border border-stone-200 bg-white rounded-lg">
      <thead>
        <tr className="bg-stone-200">
          <th
            colSpan={3}
            className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600 border-b-[.1rem] border-stone-100"
          >
            Spools
          </th>
        </tr>
        <tr className="bg-stone-200">
          <th className="max-w-4 px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Itens
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            Códigos
          </th>
          <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-stone-600">
            QTD.
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200">
        {items?.map((item, index) => (
          <tr
            key={item.concat(index)}
            className="hover:bg-stone-50 transition odd:bg-white"
          >
            <td className="px-1 py-1 max-w-4 text-xs sm:text-sm md:text-base text-center text-stone-800">
              {index + 1}
            </td>
            <td className="min-w-14 tracking-wider px-1 py-2 text-xs sm:text-sm md:text-base text-stone-800 text-center">
              <small className="flex flex-col justify-center item-center">
                <span className="flex flex-row gap-1 justify-center items-center text-center">
                  {item}
                </span>
              </small>
            </td>
            <td className="px-1 py-1 text-xs sm:text-sm md:text-base text-center text-stone-800">
              {index == 0 ? index + 1 : index + 1 - index}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className={items?.length === 0 || !items ? "hidden" : ""}>
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
