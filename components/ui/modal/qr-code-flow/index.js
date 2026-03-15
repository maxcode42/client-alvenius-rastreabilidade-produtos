import { useCallback, useEffect } from "react";

import QRCode from "components/ui/qr-code";
import Separator from "components/ui/separator";
import TextSpool from "components/ui/text-spool";

import { formatObjectSpool } from "util/formatters/parseQRCode";
import { normalizeAlphanumeric } from "util/formatters/text";
import { formatCodeDefault } from "util/formatters/code";

import { PROCESS_FLOW } from "types/process-flow";

import { useQRCode } from "hooks/qr-code-context";
import QRCodeFormQuestion from "components/ui/qr-code/qr-code-form-question";
import { PROCESS_STATUS } from "types/process-status";

export default function QRCodeFlow() {
  const {
    checkCodeExists,
    setCurrentSpool,
    currentProcess,
    setOpenAlert,
    currentSpool,
    setMessage,
    openQRCode,
    setSpool,
    action,
    result,
    spool,
  } = useQRCode();

  const checkIfCodeExists = useCallback(
    async (code) => {
      code = normalizeAlphanumeric(code);

      if (checkCodeExists && code) {
        const result = await action({ code });

        return (await result?.codigo) === code ? result : null;
      }

      const results = currentSpool?.codigo === code ? currentSpool : null;

      return results;
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSpool, checkCodeExists],
  );

  const handleQrDecoded = useCallback(async () => {
    if (!result) {
      return;
    }

    const parsedSpool = await formatObjectSpool(result);

    if (!parsedSpool) {
      setMessage(
        "Ler um QRCode de SPOOL, ou este QRCODE está danificado ou é inválido!",
      );
      setSpool(null);
      setOpenAlert(true);
      return null;
    }

    const isEqualCode = await checkIfCodeExists(parsedSpool?.codigo);

    if ((!spool && !result) || (spool !== null && currentSpool !== null)) {
      return;
    }

    if (!isEqualCode) {
      if (checkCodeExists) {
        setMessage(
          `O código escaneado sem cadastrado ou não foi encontrado no sistema`,
        );
        setCurrentSpool(null);
      } else {
        setMessage(
          `O código escaneado é diferente, para continuar ler o QRCode do SPOOL código: ${formatCodeDefault(currentSpool?.codigo)}`,
        );
      }
      setSpool(null);
      setOpenAlert(true);
      return;
    }

    if (
      checkCodeExists &&
      PROCESS_FLOW?.route?.[currentProcess]?.acronym !==
        isEqualCode?.process_acronym
    ) {
      setMessage(
        `O código escaneado encontra-se no processo de ${PROCESS_FLOW?.name?.[isEqualCode?.process_acronym]}. 
        Leia um QRCode de ${PROCESS_FLOW?.name?.[PROCESS_FLOW?.route?.[currentProcess]?.acronym]}`,
      );
      setSpool(null);
      setOpenAlert(true);
      return;
    }

    if (!currentSpool && checkCodeExists) {
      setCurrentSpool(isEqualCode);
    }

    setMessage(`Spool: ${parsedSpool.codigo} - ${parsedSpool.descricao}`);
    setSpool(parsedSpool);
    setOpenAlert(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spool, result]);

  useEffect(() => {
    handleQrDecoded();
  }, [handleQrDecoded]);

  if (!openQRCode) return null;

  return (
    <QRCode>
      <div className="flex flex-col py-2">
        <p className="text-sm font-semibold text-center">
          Ler o QRCode do Spool - CUSTOM.
        </p>
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
    </QRCode>
  );
}
