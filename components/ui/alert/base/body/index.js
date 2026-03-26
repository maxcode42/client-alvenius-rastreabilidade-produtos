export default function AlertBody({ message, children }) {
  return (
    <section
      // className="w-full px-4 py-16"
      className={`w-full px-4 py-16
              opacity-0
              translate-y-4
              animate-scaleInCenter
              [animation-delay:${120}ms]
              animation-fill-mode:forwards
            `}
    >
      <p className={`${message?.length === 0 ?? "hidden"} text-lg`}>
        {message}
      </p>
      {children}
    </section>
  );
}
