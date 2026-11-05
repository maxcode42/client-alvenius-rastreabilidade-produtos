import { SearchIcon } from "lucide-react";

export default function Search({ text, action }) {
  return (
    <div className="relative w-full h-14 mt-2">
      <SearchIcon className="absolute left-1 top-4 flex h-6 w-8 items-center justify-center p-0 m-0 size-5 text-stone-300" />

      <input
        type="text"
        id="search-input"
        value={text}
        onChange={(e) => action(e.target.value)}
        className={`w-full h-14 pl-9 pr-4 text-xs bg-transparent outline-none    focus:outline-none focus:ring-0 focus:border-blue-400/50 shadow-md shadow-blue-300/50 border-2 border-stone-300/50 rounded-md`}
        placeholder="Buscar por código, status, data"
      />
    </div>
  );
}
