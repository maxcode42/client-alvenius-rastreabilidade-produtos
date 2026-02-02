export default function Body({ children }) {
  return (
    <main className="flex flex-col w-full overflow-hidden md:overflow-auto relative h-full z-59 py-40">
      <div className="flex flex-col gap-4 w-full justify-between items-center relative h-full">
        <h2 className="fixed z-50 shadow-blue-600/50 shadow-md font-semibold text-4x sm:text-2xl py-4 px-8 rounded-lg mt-[-38px] bg-stone-50">
          Rastreabilidade de produtos
        </h2>
        {children}
      </div>
    </main>
  );
}
