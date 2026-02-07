export default function AlertBody({ message, children }) {
  return (
    <section className="w-full px-4 py-16">
      <p className="text-lg">{message}</p>
      {children}
    </section>
  );
}
