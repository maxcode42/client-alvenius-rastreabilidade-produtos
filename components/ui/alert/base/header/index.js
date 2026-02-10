import { XIcon } from "lucide-react";

export function AlertHeader({ setOpenAlert, title, children }) {
  return (
    <>
      <div className="flex flex-row justify-end items-center w-full">
        <button
          onClick={() => setOpenAlert(false)}
          className="flex flex-row justify-center"
        >
          <XIcon size={32} className="text-red-600/50" />
        </button>
      </div>
      <section className="w-full px-4 py-4 border-b-2 border-950/50 flex flex-col items-center gap-4">
        {children}
        <h3 className="text-2xl text-center">{title}</h3>
      </section>
    </>
  );
}
