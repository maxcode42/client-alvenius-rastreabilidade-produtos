export default function HeaderPageText({ children }) {
  return (
    <section className="w-full text-xs sm:text-lg flex flex-col sm:h-36 lg:h-48">
      {children}
    </section>
  );
}
