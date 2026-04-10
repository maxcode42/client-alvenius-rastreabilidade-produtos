import Button from "components/ui/button";
import { XCircleIcon, XIcon } from "lucide-react";

export default function MenuSelect({
  children,
  title,
  message,
  openAlert,
  actionClose,
}) {
  return (
    <div className="fixed inset-0 z-40 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 pb-16 sm:pb-0 ">
      <div
        className={`
          fixed top-0 z-50 h-full flex flex-col items-center justify-center
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
          {/* header */}
          <div
            className={`w-full
                opacity-0
                translate-y-4
                animate-scaleInCenter
                [animation-delay:${120}ms]
                animation-fill-mode:forwards
              `}
          >
            <div className="flex flex-row justify-end items-center w-full">
              <button
                onClick={() => {
                  actionClose();
                }}
                className="flex flex-row justify-center"
              >
                <XIcon size={32} className="text-red-600/50" />
              </button>
            </div>
            <section className="w-full px-4 py-4 border-b-2 border-950/50 flex flex-col items-center gap-4">
              <h3 className="text-2xl text-center">{title}</h3>
            </section>
          </div>
          {/* body */}
          <section
            className={`w-full px-4 py-4 mt-4
                      opacity-0
                      translate-y-4
                      animate-scaleInCenter
                      [animation-delay:${120}ms]
                      animation-fill-mode:forwards
                      h-full flex flex-col justify-center items-center 
                    `}
          >
            <p className={`${message?.length === 0 ?? "hidden"} text-lg`}>
              {message}
            </p>
            {children}
          </section>
          {/* footer */}
          <section
            //className="w-full px-4 py-4 border-t-2 border-950/50"
            className={`w-full px-4 py-4 border-t-2 border-950/50
                      opacity-0
                      translate-y-4
                      animate-scaleInCenter
                      [animation-delay:${120}ms]
                      animation-fill-mode:forwards
                    `}
          >
            <div className=" w-full h-full flex flex-row gap-4 py-4">
              <Button
                onClick={(e) => {
                  actionClose(e);
                }}
                className="w-full flex flex-row justify-center items-center gap-2 text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
              >
                <XCircleIcon className="size-4" />
                Fechar
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
