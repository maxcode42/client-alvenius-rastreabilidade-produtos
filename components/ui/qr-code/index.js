//import AlertInfo from "../alert/info";
import QRCodeBody from "./qr-code-body";
import QRCodePanel from "./qr-code-panel";
import QRCodeHeader from "./qr-code-header";
import QRCodeFooter from "./qr-code-footer";
import QRCodeCamera from "./qr-code-camera";
import QRCodeButton from "./qr-code-button";
// import AlertInfo from "../alert/info";

// import { useQRCode } from "hooks/qr-code-context";

export default function QRCode({ children }) {
  // const { message, openAlert, setOpenAlert } = useQRCode();

  return (
    <QRCodePanel>
      <QRCodeHeader>
        <QRCodeCamera />
      </QRCodeHeader>
      <QRCodeBody>{children}</QRCodeBody>
      <QRCodeFooter />

      <QRCodeButton />

      {/* Alert */}
      {/* <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={() => {}}
      /> */}
    </QRCodePanel>
  );
}
