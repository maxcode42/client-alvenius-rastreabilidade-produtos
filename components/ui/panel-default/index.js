export default function PanelDefault({ children }) {
  return (
    <div className="flex flex-col w-full px-4 py-6 md:mt-16 justify-start items-center h-full overflow-hidden">
      <section className="overflow-y-scroll md:overflow-hidden h-full min-h-[70vh] sm:h-full sm:w-1/2 px-4 py-4 w-full flex flex-col gap-2 justify-start items-start border-blue-950/50 border-2 rounded-sm">
        {children}
      </section>
    </div>
  );
}
