import { InfoIcon, XIcon } from "lucide-react";

export default function AlertInfo({ openAlert, setOpenAlert, message }) {
  return (
    <div
      className={`
          absolute top-0 z-40 h-full flex flex-col items-center justify-center
          bg-blue-950/50 w-full gap-2 px-4 
          transform transition-all duration-300 ease-in-out
          ${
            openAlert
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
          `}
    >
      <div className="w-full max-w-md bg-stone-100 border-2 border-950/50 rounded-md flex flex-col justify-center items-center p-4">
        <div className="flex flex-row justify-end items-center w-full">
          <button
            onClick={() => setOpenAlert(false)}
            className="flex flex-row justify-center"
          >
            <XIcon size={32} className="text-red-600/50" />
          </button>
        </div>
        <section className="w-full px-4 py-4 border-b-2 border-950/50 flex flex-col items-center gap-4">
          <InfoIcon size={64} className="text-blue-950/50 animate-pulse" />
          <h3 className="text-2xl text-center">Informação</h3>
        </section>
        <section className="w-full px-4 py-16">
          <p className="text-lg">{message}</p>
        </section>
        <section className="w-full px-4 py-4 border-t-2 border-950/50">
          <div className="flex flex-col w-full h-full py-4 ">
            <button
              onClick={() => setOpenAlert(false)}
              className="w-full text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
            >
              Fechar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
