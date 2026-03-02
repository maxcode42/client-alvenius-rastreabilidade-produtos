import AlertInfo from "../alert/info";
import QRCodeBody from "./qr-code-body";
import QRCodePanel from "./qr-code-panel";
import QRCodeHeader from "./qr-code-header";
import QRCodeFooter from "./qr-code-footer";
import QRCodeCamera from "./qr-code-camera";
import QRCodeButton from "./qr-code-button";

import { useQRCode } from "hooks/qr-code-context";

export default function QRCode({
  //   message,
  //   openAlert,
  //   setScannerLocked,
  //   scannerLocked,
  //   setOpenAlert,
  //   setMessage,
  //   setResult,
  //   setSpool,
  //   result,
  children,
  //   currentSpool,
  //   onClose,
  //   spool,
  //   action,
}) {
  console.count(">>QR-CODE-CUSTOM");
  const {
    message,
    openAlert,
    setScannerLocked,
    //scannerLocked,
    setOpenAlert,
    //setMessage,
    //setResult,
    //setSpool,
    // result,
    // currentSpool,
    // onClose,
    // spool,
    // action,
  } = useQRCode();
  return (
    <QRCodePanel>
      <QRCodeHeader>
        <QRCodeCamera
        // setScannerLocked={setScannerLocked}
        // scannerLocked={scannerLocked}
        // setOpenAlert={setOpenAlert}
        // setMessage={setMessage}
        // setResult={setResult}
        // setSpool={setSpool}
        />
      </QRCodeHeader>
      <QRCodeBody>{children}</QRCodeBody>
      <QRCodeFooter
      //result={result}
      />

      <QRCodeButton
        // spool={spool}
        // action={action}
        // onClose={onClose}
        // currentSpool={currentSpool}
        className="flex flex-row w-full h-full py-8 gap-4 sm:w-1/2"
      />

      {/* Alert */}
      <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={setScannerLocked}
      />
    </QRCodePanel>
  );
}
