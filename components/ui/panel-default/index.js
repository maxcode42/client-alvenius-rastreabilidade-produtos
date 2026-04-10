export default function PanelDefault({ children }) {
  return (
    <div
      className="flex flex-col w-full px-4 py-2 -mt-8 lg:mt-16 
    justify-start items-center h-full lg:min-h-[80vh] overflow-hidden"
    >
      <section
        className="overflow-y-scroll md:overflow-hidden h-full min-h-[70vh] md:h-full 
      w-full flex flex-col lg:w-1/2 px-4 py-4 gap-2 justify-start items-start 
      border-blue-950/50 border-2 rounded-sm shadow-md shadow-stone-600/50"
      >
        {children}
      </section>
    </div>
  );
}
