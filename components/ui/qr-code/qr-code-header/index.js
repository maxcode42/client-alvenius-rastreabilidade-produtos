export default function QRCodeHeader({ children }) {
  return (
    <section className="flex flex-col py-2 w-full">
      {/* Header */}
      <div className="w-full max-w-md flex justify-center items-center p-4 text-white">
        <h2 className="text-lg font-semibold">Leitor de QRCode</h2>
      </div>
      <div className="flex flex-col border-2 border-stone-300/50 w-full rounded-full" />
      {children}
    </section>
  );
}
