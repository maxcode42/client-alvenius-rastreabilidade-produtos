import { AuthProvider } from "../auth/auth-context";
import { QRCodeProvider } from "hooks/qr-code-context";

import "./styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <QRCodeProvider>
        <Component {...pageProps} />
      </QRCodeProvider>
    </AuthProvider>
  );
}
