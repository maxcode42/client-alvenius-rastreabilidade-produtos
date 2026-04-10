import { SearchIcon } from "lucide-react";

export default function Search({ text, action }) {
  return (
    <div
      className=" rounded-md border-stone-2 gap-2 w-full 
     h-full py-1 flex flex-row items-center justify-start mt-2"
    >
      <SearchIcon className="size-6 text-stone-300 absolute left-12 lg:ml-[50vh] lg:w-fit" />
      <input
        type="text"
        id="search-input"
        value={text}
        onChange={(e) => action(e.target.value)}
        className="outline-none focus:outline-none focus:ring-0 focus:border-blue-400/50 text-xs w-full bg-transparent
        h-14 shadow-md shadow-blue-300/50 border-stone-300/50 rounded-md border-2 pl-10 lg:pl-14 pr-2"
        placeholder="Buscar por código, status, data"
      />
    </div>
  );
}
