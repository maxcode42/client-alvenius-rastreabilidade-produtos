import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AsteriskIcon, QrCodeIcon } from "lucide-react";

// import { PRODUCTS_TYPES } from "types/acronyms-tubes";
import { useQRCode } from "hooks/qr-code-context";
import QRCode from "components/ui/qr-code";

import withAuth from "../../auth/auth-with";
import Button from "components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  formatObjectComponent,
  formatObjectSpool,
} from "util/formatters/parseQRCode";
import AlertCustom from "components/ui/alert";
import { QRCODE_TYPES } from "types/qr-code-reading";
import { validateFieldsComponent } from "util/validate";
// import { formatCodeDefault } from "util/formatters/code";

import { PROCESS_FLOW } from "types/process-flow";
import api from "infra/provider/api-web";

function ValidatesQRcode() {
  const {
    setQrCodeReadingType,
    setScannerLocked,
    setCurrentSpool,
    setOpenAlert,
    setMessage,
    setOpenQRCode,
    openAlert,
    result,
    setResult,
    setCheckCodeExists,
    setCurrentProcess,
    setOnClose,
    setAction,
    message,
  } = useQRCode();

  const [openQRCodeBase, setOpenQRCodeBase] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertType, setAlertType] = useState("error");

  const processingRef = useRef(false);
  const currentRoute = usePathname();
  const router = useRouter();
  const dataIsNotValid = [];

  async function findOnByCode({ code, route }) {
    const results = await api.execute[route].find({ params: code });

    return results?.data?.[0] ?? {};
  }

  const checkIfCodeExists = async function (route, code) {
    if (!code || code.length === 0) return true;

    let results = null;

    //const response = await action({ code });
    const response = await findOnByCode({ route, code });

    results = (await response?.codigo) === code ? response : null;

    if (!results || results?.codigo?.trim().length === 0) {
      return {
        error: "invalid",
        message: `código: ${code},
          
          O código escaneado sem cadastrado ou não foi encontrado no sistema`,
      };
    }

    return results;
  };

  const parseQrSpoolToJson = () => {
    // if (!result || currentSpool !== null) {
    //   return;
    // }
    if (!result) {
      return;
    }

    const parsedSpool = formatObjectSpool(result);

    if (!parsedSpool) {
      //  setMessage(
      //    "Ler um QRCode de SPOOL! Este QRCODE está danificado ou é inválido!",
      //  );

      //  setSpool(null);

      //  if (checkCodeExists) setCurrentSpool(null);

      return null;
    }

    return parsedSpool;
  };

  const parseQrTextToJson = () => {
    if (!result) {
      return;
    }
    const parsedComponent = formatObjectComponent(result); //getResult)//

    const validation = validateFieldsComponent(parsedComponent);

    if (Object.keys(parsedComponent).length === 0) {
      return null;
    }

    if (!validation.valid) {
      setMessage(`O QRCode "COMPONENTE" é inválido, está fora do padrão definido. 
      Gere um novo QRCode padronizado.
        
      CAMPO INVÁLIDO: ${validation.missingFields}
    `);

      //  setMessage(
      //    `CAMPO INVALIDO: ${validation.missingFields}. O QRCode deste COMPONENTE está fora do padrão e modelo definido, gerar um novo QRCode.`,
      //  );
      dataIsNotValid.push("component");
      return null;
    }

    // if (
    //   Object.keys(parsedComponent).length > 4 ||
    //   Object.keys(parsedComponent).length < 4
    // ) {
    //   setMessage(`O QRCode "COMPONENTE" é inválido, está fora do padrão definido.
    //   Gere um novo QRCode padronizado.

    //   CAMPO INVÁLIDO: QRCode não pode conter ${Object.keys(parsedComponent).length} campo(s).
    // `);

    //   dataIsNotValid.length === 1 && dataIsNotValid.push("component");
    //   return null;
    // }

    return parsedComponent;
  };

  async function extractQRCodeData(readingType) {
    const fnReadingType = {
      spool: async () => {
        const parsed = await parseQrSpoolToJson();

        if (!parsed) return null;

        setCheckCodeExists(true);
        const route = PROCESS_FLOW.route.boilermaking.name;
        const isEqualCode = await checkIfCodeExists(route, parsed?.codigo);

        if (!isEqualCode || isEqualCode?.error) {
          return isEqualCode;
        }

        return `O QRCode está conforme e Válido. 

        Spool: ${parsed.codigo} - ${parsed.descricao}`;
      },
      component: async () => {
        //  console.log('COMPONENT')
        //  console.log(parsed)

        const parsed = await parseQrTextToJson();
        if (!parsed) return null;

        setCheckCodeExists(true);
        const route = "component";
        const isEqualCode = await checkIfCodeExists(route, parsed?.COD_PRODUTO);

        if (!isEqualCode || isEqualCode?.error) {
          return isEqualCode;
        }

        const objectItem = {
          codigo: parsed?.COD_PRODUTO,
          fornecedor: parsed?.COD_FORNEC,
          fluxo: parsed?.CORRIDA,
          descricao: parsed?.DESC,
          quantidade: 1,
        };

        //  if (checkIfItContainsProductType(parsed.COD_PRODUTO)) {
        //    processingRef.current = false;
        //    setPendingItem(objectItem);

        //    return null;
        //  }

        //setItens((prev) => [...prev, objectItem]);

        return `O QRCode está conforme e Válido. 

        Componente: ${objectItem.codigo} - ${objectItem.descricao}`;
      },
    };

    const ex = await fnReadingType[readingType];

    return ex();
  }

  const handleQrDecoded = useCallback(
    async () => {
      if (!result || openAlert || processingRef.current) return;

      //setScannerLocked(true);
      processingRef.current = true;

      setOpenAlert(true);
      setScannerLocked(true);
      setOpenQRCodeBase(true);
      if (result.trim().length === 0) {
        setMessage(`O QRCode é inválido, ou
        está fora do padrão definido. 
        
        Gere um novo QRCode padronizado.`);

        return;
      }

      let resultExtract = await extractQRCodeData(QRCODE_TYPES.spool);

      await setQrCodeReadingType([QRCODE_TYPES.component]);

      if (resultExtract?.error === "invalid") {
        setMessage(resultExtract.message);
        return;
      }

      if (!resultExtract && !resultExtract?.error) {
        //  if (!resultExtract && qrCodeReadingType.length > 1) {
        dataIsNotValid.push("spool");
        resultExtract = await extractQRCodeData(QRCODE_TYPES.component);

        if (resultExtract?.error === "invalid") {
          setMessage(resultExtract.message);
          return;
        }
      }

      //const isOpenQRCodeBase = true;//!pendingItem ? true : false;

      //setQrCodeReadingType([QRCODE_TYPES.spool, QRCODE_TYPES.component]);
      //setOpenQRCodeBase(isOpenQRCodeBase);
      //  setOpenAlert(true);
      // setScannerLocked(true);
      // setOpenQRCodeBase(true);

      if (
        !message &&
        !resultExtract &&
        dataIsNotValid.includes("spool") &&
        !dataIsNotValid.includes("component")
      ) {
        setMessage(`O QRCode é inválido, ou
        está fora do padrão definido. 
        
        Gere um novo QRCode padronizado.`);

        setAlertTitle("Alert");
        setAlertType("alert");
      }

      //  if(dataIsNotValid.includes('spool')){
      //   setMessage(`Error:
      //    O QRCode "SPOOL" é inválido, ou está fora do padrão definido.
      //    Gere um novo QRCode padronizado.`);
      //  }

      if (!resultExtract) return;

      setAlertTitle("Sucesso");
      setAlertType("success");
      setMessage(resultExtract);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result],
  );

  function closeAlertQRCodeBase() {
    processingRef.current = false;
    setOpenQRCodeBase(false);
    setOpenAlert(false);
    setAlertTitle("Error");
    setAlertType("error");
    setMessage(null);
  }

  const assignDefaultStandards = useCallback(() => {
    setQrCodeReadingType([QRCODE_TYPES.spool, QRCODE_TYPES.component]);
    setCheckCodeExists(false);

    setOnClose(() => {
      return () => {
        setOpenQRCode(false),
          setResult(null),
          setScannerLocked(true),
          router.replace("/");
      };
    });

    setAction(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openModalQRCode(e) {
    e.preventDefault();
    //setResult(null);
    setOpenQRCode(true);
    setOpenAlert(false);
    setOpenQRCodeBase(false);
    setCurrentSpool(null);
    setCheckCodeExists(false);
    setScannerLocked(false);
    setCurrentProcess(currentRoute.replace("/", ""));
    //setResult("SP-0000-00340-016 Carretel FS+FF 10pol x 6,35 x 2500mm 150 PSI");

    //setResult("SP-0415-00340-016 Carretel FS+FF 10pol x 6,35 x 2500mm 150 PSI");
    //setResult("S-0415-00340-016 Carretel FS+FF 10pol x 6,35 x 2500mm 150 PSI");

    //setResult(`QUERO SO TESTAR para definir parametor de validate. `)

    // setResult(`COD_PRODUTO: FLW21224109Z211 I
    //   COD_FORNEC: 005436 I
    //   CORRIDA: 27125074 I
    //   DESC: FL 323MM SOLTO PR AWWA C207 CLD
    //   DES: AMR-1006916-06-ALV-CP0096-0410-PI-SD-00002`)

    // setResult(`COD_PRODUTO: FLW21224109Z211 I
    //       COD_FORNEC: 005436 I
    //       CORRIDA: 27125074 I
    //       DESC: FL 323MM SOLTO PR AWWA C207 CLD DES AMR-1006916-06-ALV-CP0096-0410-PI-SD-00002`);

    // setResult(`COD_PRODUTO: FLW21224109ZRTTY I
    //       COD_FORNEC: 005436 I
    //       CORRIDA: 27125074 I
    //       DESC: FL 323MM SOLTO PR AWWA C207 CLD DES AMR-1006916-06-ALV-CP0096-0410-PI-SD-00002`);
  }

  useEffect(() => {
    assignDefaultStandards();

    setCheckCodeExists(false);
    setOpenQRCodeBase(false);
    setOpenAlert(false);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!result) return;
    handleQrDecoded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, handleQrDecoded]);

  //  if (!openQRCode) return null;

  return (
    // <ProcessFlow
    //   title={"Caldeiraria"}
    //   route={PROCESS_FLOW.route.validatesqrcode.name}
    //   textModal={"para buscar o SPOOL e seguir fluxo do"}
    //   info={"Leitura Spool, iniciar, finalizar e executar processo produção."}
    // />
    <Fragment>
      <QRCode>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-center">
            Ler o QRCode do Spool e Componentes.
          </h2>
          <p className="text-sm font-semibold flex flex-row">
            <AsteriskIcon className="size-4 text-red-400" />
            Verificar os campos e dados, validar o QRCode.
          </p>
        </div>

        <div className="w-full h-16 flex gap-4 flex-row items-center justify-center">
          <div className="w-1/2 md:w-1/4 sm:w-full h-16 flex gap-4 flex-row items-center justify-center">
            <Button
              type="button"
              onClick={(e) => openModalQRCode(e)}
              title="Ler QRCode."
            >
              <QrCodeIcon className="size-6 sm:size-8" />
              <span className="text-xs sm:text-base">Ler QRCode</span>
            </Button>
          </div>
        </div>
      </QRCode>

      {openQRCodeBase && openAlert && message !== null && (
        <AlertCustom
          actionClose={() => {
            closeAlertQRCodeBase();
          }}
          title={alertTitle}
          type={alertType}
        />
      )}
    </Fragment>
  );
}

export default withAuth(ValidatesQRcode);
