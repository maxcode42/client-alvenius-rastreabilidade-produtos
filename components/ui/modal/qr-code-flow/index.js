import { useEffect } from "react";

import QRCodeBase from "../qr-code-base";
import Separator from "components/ui/separator";
import TextSpool from "components/ui/text-spool";
import QRCodeFormQuestion from "components/ui/qr-code/qr-code-form-question";

import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";
import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeFlow() {
  const { currentSpool, spool } = useQRCode();

  useEffect(() => {
    if (!spool) return;
    // }, [spool, currentSpool]);
  }, [spool]);

  return (
    <QRCodeBase>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-center">
          Ler o QRCode do Spool.
        </h2>
        <p className="text-sm font-semibold text-center">
          <strong className="text-md font-bold uppercase">
            {
              PROCESS_FLOW.text_next_allowed[
                currentSpool?.status_acronym || "default"
              ]
            }
          </strong>{" "}
          processo produto.
        </p>
      </div>

      <Separator />

      {spool && (
        <div className="flex flex-col py-5">
          <TextSpool spool={spool} />

          {String(currentSpool?.status_acronym).toUpperCase() ===
            PROCESS_STATUS.acronym.finalizado && <QRCodeFormQuestion />}
        </div>
      )}
    </QRCodeBase>
  );
}
