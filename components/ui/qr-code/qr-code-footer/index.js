export default function QRCodeFooter({ result }) {
  return (
    <section className="flex flex-col py-4 bg-white w-full max-w-md p-4 rounded-md">
      <p className="text-sm font-semibold">Último QRCode lido:</p>
      <p className="mt-2 text-xs break-all text-gray-700 w-full flex flex-row justify-center item-center">
        {result ?? (
          <span className="animate-pulse mt-2 px-4 py-2 rounded-md w-fit">
            Aguardando leitura...
          </span>
        )}
      </p>
    </section>
  );
}
