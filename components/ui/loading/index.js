import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div
      className={`
              flex flex-col justify-center items-center h-full w-full min-h-72
              opacity-0
              translate-y-4
              animate-scaleInCenter
              //[animation-delay:${120}ms]
              animation-fill-mode:forwards
      `}
    >
      <Loader2Icon className="-mt-12 size-44 animate-spin text-blue-400/50" />
      <p className="w-fit -mt-[11.5vh] text-stone-300 text-xs md:text-sm animate-pulse px-2 py-2 rounded-md  flex flex-col justify-center items-center">
        Carregando...
      </p>
    </div>
  );
}
