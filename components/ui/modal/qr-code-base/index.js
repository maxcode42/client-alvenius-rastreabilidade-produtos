import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import QRCode from "components/ui/qr-code";
import AlertCustom from "components/ui/alert";

import {
  formatObjectComponent,
  formatObjectSpool,
} from "util/formatters/parseQRCode";
import { validateFieldsComponent } from "util/validate";

import { useQRCode } from "hooks/qr-code-context";

import { PRODUCTS_TYPES } from "types/acronyms-tubes";
import { QRCODE_TYPES } from "types/qr-code-reading";
import { PROCESS_FLOW } from "types/process-flow";
import { formatCodeDefault } from "util/formatters/code";

export default function QRCodeBase({ children }) {
  const {
    setQrCodeReadingType,
    qrCodeReadingType,
    setScannerLocked,
    checkCodeExists,
    setCurrentSpool,
    currentProcess,
    setPendingItem,
    currentSpool,
    setOpenAlert,
    pendingItem,
    setMessage,
    openQRCode,
    openAlert,
    setSpool,
    setItens,
    result,
    action,
    spool,
  } = useQRCode();

  const [openQRCodeBase, setOpenQRCodeBase] = useState(false);

  const productsTypes = useMemo(() => PRODUCTS_TYPES, []);
  const processingRef = useRef(false);

  const checkIfCodeExists = useCallback(
    async (code) => {
      if (!checkCodeExists && qrCodeReadingType.length > 1) return true;

      let results = null;

      if (checkCodeExists && code) {
        const response = await action({ code });

        results = (await response?.codigo) === code ? response : null;
      } else {
        results = currentSpool?.codigo === code ? currentSpool : null;
      }

      if (!results) {
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
      }

      return results;
    },

    // [currentSpool, checkCodeExists],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const parseQrSpoolToJson = () => {
    // if (!result || currentSpool !== null) {
    //   return;
    // }
    if (!result) {
      return;
    }

    const parsedSpool = formatObjectSpool(result);

    if (!parsedSpool) {
      setMessage(
        "Ler um QRCode de SPOOL! Este QRCODE está danificado ou é inválido!",
      );

      setSpool(null);

      if (checkCodeExists) setCurrentSpool(null);

      return null;
    }

    return parsedSpool;
  };

  const parseQrTextToJson = () => {
    if (!result) {
      return;
    }
    const parsedComponent = formatObjectComponent(result);

    if (!parsedComponent.COD_PRODUTO) {
      setMessage(
        "Ler um QRCode de COMPONENTE! Este QRCODE está danificado ou é inválido!",
      );

      return null;
    }

    const validation = validateFieldsComponent(parsedComponent);

    if (!validation.valid) {
      setMessage(
        `CAMPO INVALIDO: ${validation.missingFields}. O QRCode deste COMPONENTE está fora do padrão e modelo definido, gerar um novo QRCode.`,
      );

      return null;
    }

    return parsedComponent;
  };

  const checkIfItContainsProductType = useCallback(
    (codigo) => {
      return productsTypes.some((t) => codigo.includes(t));
    },
    [productsTypes],
  );

  async function extractQRCodeData() {
    const readingType = qrCodeReadingType[0];

    const fnReadingType = {
      spool: async () => {
        const parsed = await parseQrSpoolToJson();

        if (!parsed) return null;

        const isEqualCode = await checkIfCodeExists(parsed?.codigo);

        if (
          (!spool && !result) ||
          (spool !== null && currentSpool !== null) ||
          !isEqualCode
        ) {
          return null;
        }

        if (
          checkCodeExists &&
          PROCESS_FLOW?.route?.[currentProcess]?.acronym !==
            isEqualCode?.process_acronym
        ) {
          setMessage(
            `O código escaneado encontra-se no processo de ${String(PROCESS_FLOW?.name?.[isEqualCode?.process_acronym]).toUpperCase()}. 
        Leia um QRCode de ${PROCESS_FLOW?.name?.[PROCESS_FLOW?.route?.[currentProcess]?.acronym]}`,
          );
          setSpool(null);

          return null;
        }

        if (!currentSpool && checkCodeExists) {
          setCurrentSpool(isEqualCode);
          setSpool(isEqualCode);
        } else if (currentSpool && !checkCodeExists && isEqualCode) {
          setSpool(isEqualCode);
        } else {
          setCurrentSpool(parsed);
          setSpool(parsed);
        }

        if (qrCodeReadingType.length > 1) {
          setQrCodeReadingType([QRCODE_TYPES.component]);
        }

        return `Spool: ${parsed.codigo} - ${parsed.descricao}`;
      },
      component: async () => {
        const parsed = await parseQrTextToJson(result);

        if (!parsed) return null;

        const objectItem = {
          codigo: parsed?.COD_PRODUTO,
          fornecedor: parsed?.COD_FORNEC,
          fluxo: parsed?.CORRIDA,
          descricao: parsed?.DESC,
          quantidade: 1,
        };

        if (checkIfItContainsProductType(parsed.COD_PRODUTO)) {
          processingRef.current = false;
          setPendingItem(objectItem);

          return null;
        }

        setItens((prev) => [...prev, objectItem]);

        return `Componente: ${objectItem.codigo} - ${objectItem.descricao}`;
      },
    };

    const ex = await fnReadingType[readingType];

    return ex();
  }

  const handleQrDecoded = useCallback(
    async () => {
      if (!result || openAlert || processingRef.current) return;

      setScannerLocked(true);
      processingRef.current = true;

      const resultExtract = await extractQRCodeData();

      const isOpenQRCodeBase = !pendingItem ? true : false;

      setOpenQRCodeBase(isOpenQRCodeBase);
      setOpenAlert(true);

      if (!resultExtract) return;

      setMessage(resultExtract);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result],
  );

  function closeAlertQRCodeBase() {
    processingRef.current = false;
    setOpenQRCodeBase(false);
  }

  useEffect(() => {
    if (!result) return;
    handleQrDecoded();
  }, [result, handleQrDecoded]);

  if (!openQRCode) return null;

  return (
    <Fragment>
      <QRCode>{children}</QRCode>

      {openQRCodeBase && openAlert && (
        <AlertCustom
          actionClose={() => {
            closeAlertQRCodeBase();
          }}
          title="Informação"
          type="info"
        />
      )}
    </Fragment>
  );
}
