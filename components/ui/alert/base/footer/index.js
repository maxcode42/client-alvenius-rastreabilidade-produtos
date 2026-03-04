export default function AlertFooter({ children }) {
  return (
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
      {children}
    </section>
  );
}
