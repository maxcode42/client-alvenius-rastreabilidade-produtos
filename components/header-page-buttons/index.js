import { QrCodeIcon } from "lucide-react";

import Search from "components/ui/search";
import Button from "components/ui/button";

import { useQRCode } from "hooks/qr-code-context";

export default function HeaderPageButtons({
  searchText,
  setSearchText,
  openModalQRCode,
  setCurrentSpool,
}) {
  const { setCheckCodeExists } = useQRCode();
  return (
    <section className="w-full h-16 flex gap-4 flex-row justify-end items-center">
      <Search text={searchText} action={setSearchText} />

      <div className="w-1/2 md:w-1/4 sm:w-full h-16 flex gap-4 flex-row">
        <Button
          type="button"
          onClick={(e) => (
            setCurrentSpool(null), openModalQRCode(e), setCheckCodeExists(true)
          )}
          title="Ler QRCode para buscar e iniciar, finalizar ou aprovar CQ."
        >
          <QrCodeIcon className="size-6 sm:size-8" />
          <span className="text-xs sm:text-base">Ler QRCode</span>
        </Button>
      </div>
    </section>
  );
}
