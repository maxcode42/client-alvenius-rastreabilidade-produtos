import { QRCodeProvider } from "hooks/qr-code-context";
import { AuthProvider } from "../auth/auth-context";
import { MenuProvider } from "hooks/menu-context";

import "./styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <QRCodeProvider>
      <AuthProvider>
        <MenuProvider>
          <Component {...pageProps} />
        </MenuProvider>
      </AuthProvider>
    </QRCodeProvider>
  );
}
