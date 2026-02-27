export default function TextSpool({ spool }) {
  return (
    <section className="flex flex-col gap-1">
      <p className="text-md sm:text-lg break-all font-bold">SPOOL</p>
      <p className="w-full flex flex-row gap-1 text-xs max-w-xs break-words line-clamp-2">
        <span className="w-fit min-w-14 flex flex-row justify-between">
          <span className="font-semibold">Código</span>
          <span>:</span>
        </span>
        <span className="font-normal w-full">{spool?.codigo}</span>
      </p>
      <p className="w-full flex flex-row gap-1 text-xs max-w-xs break-words line-clamp-2">
        <span className="w-fit min-w-14 flex flex-row justify-between">
          <span className="font-semibold">Descrição</span>
          <span>:</span>
        </span>
        <span className="font-normal w-full">{spool?.descricao}</span>
      </p>
    </section>
  );
}
