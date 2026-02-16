export default function Body({ children }) {
  return (
    <main className="flex flex-col w-full h-full md:mt-36 py-2">
      <div className="flex flex-col gap-4 w-full h-full justify-between items-center relative">
        <h2 className="relative md:fixed z-30 shadow-blue-600/50 shadow-md font-semibold text-4x sm:text-2xl py-4 px-8 rounded-lg mt-[-38px] bg-stone-50">
          Rastreio de produtos
        </h2>
        {children}
      </div>
    </main>
  );
}
