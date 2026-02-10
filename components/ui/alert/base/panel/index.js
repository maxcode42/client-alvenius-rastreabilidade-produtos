export function AlertPanel({ openAlert, children }) {
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
        {children}
      </div>
    </div>
  );
}
