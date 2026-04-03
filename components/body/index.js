import { twMerge } from "tailwind-merge";

export default function Body({ children, title, ...props }) {
  const titleDefault = !title ? "Rastreio de produtos" : title;

  return (
    <main className="flex flex-col w-full h-full md:mt-36 py-2">
      <div className="flex flex-col gap-4 w-full h-full justify-between items-center relative">
        <h2
          className={twMerge(
            `relative md:fixed z-30 shadow-blue-600/50 shadow-md font-semibold  py-4 px-8 mt-[-38px]
            rounded-lg bg-stone-50 min-h-14 md:min-h-16 min-w-56 md:min-w-72 text-center 
            ${title ? "capitalize text-xl" : "text-lg sm:text-2xl"}`,
            props.className,
          )}
        >
          {titleDefault}
        </h2>
        {children}
      </div>
    </main>
  );
}
