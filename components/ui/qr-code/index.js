import { Fragment } from "react";
import AlertInfo from "../alert/info";
import QRCodeCamera from "../qr-code-camera";
import QRCodeBody from "./qr-code-body";
import QRCodeFooter from "./qr-code-footer";
import QRCodeHeader from "./qr-code-header";

export default function QRCode({
  message,
  openAlert,
  setScannerLocked,
  scannerLocked,
  setOpenAlert,
  setMessage,
  setResult,
  setSpool,
  result,
  children,
}) {
  return (
    <Fragment>
      <QRCodeHeader>
        <QRCodeCamera
          setScannerLocked={setScannerLocked}
          scannerLocked={scannerLocked}
          setOpenAlert={setOpenAlert}
          setMessage={setMessage}
          setResult={setResult}
          setSpool={setSpool}
        />
      </QRCodeHeader>
      <QRCodeBody>{children}</QRCodeBody>
      <QRCodeFooter result={result} />

      {/* Alert */}
      <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={setScannerLocked}
      />
    </Fragment>
  );
}
