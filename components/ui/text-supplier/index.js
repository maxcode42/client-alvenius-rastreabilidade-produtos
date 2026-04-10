export default function TextSupplier({ supplier }) {
  return (
    <section className="w-full flex flex-col gap-1">
      <p className="text-md sm:text-lg break-all font-bold">FORNECEDOR</p>
      <div className="w-full flex flex-row gap-2 justify-between ">
        <p className="w-1/2 flex flex-row gap-1 text-xs max-w-xs break-words line-clamp-2">
          <span className="w-fit min-w-14 flex flex-row justify-between">
            <span className="font-semibold">Código</span>
            <span>:</span>
          </span>
          <span className="font-normal w-full">{supplier?.code}</span>
        </p>
        <p className="w-1/2 flex flex-row gap-1 text-xs max-w-xs break-words line-clamp-2">
          <span className="w-fit min-w-8 flex flex-row justify-between">
            <span className="font-semibold">Loja</span>
            <span>:</span>
          </span>
          <span className="font-normal w-full">{supplier?.store}</span>
        </p>
      </div>

      <p className="w-full flex flex-row gap-1 text-xs max-w-xs break-words line-clamp-2">
        <span className="w-fit min-w-14 flex flex-row justify-between">
          <span className="font-semibold">Nome</span>
          <span>:</span>
        </span>
        <span className="font-normal w-full">{supplier?.name}</span>
      </p>
    </section>
  );
}
