import { SearchIcon } from "lucide-react";

export default function Search({ text, action }) {
  return (
    <div className=" rounded-md border-stone-2 gap-2 w-full sm:w-full h-full py-1 flex flex-col items-center mt-2">
      <SearchIcon className="size-6 text-stone-300 translate-y-4 absolute left-12" />
      <input
        type="text"
        id="search-input"
        value={text}
        onChange={(e) => action(e.target.value)}
        className="outline-none focus:outline-none focus:ring-0 focus:border-blue-400/50 text-xs w-full bg-transparent h-16 shadow-md shadow-blue-300/50 border-stone-300/50 rounded-md border-2 pl-10 pr-2"
        placeholder="Buscar por código, status, data"
      />
      {/*
       <div class="search-container">
        <img src="assets/search.svg" alt="Buscar" class="search-icon" />
        <input
          type="text"
          class="search-input"
          id="search-input"
          placeholder="Buscar por título"
        />
        <button class="btn btn-primary btn-full" id="btn-new">
          Novo prompt
        </button>
      </div> 
      */}
    </div>
  );
}
