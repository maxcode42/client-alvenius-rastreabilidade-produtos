import { AuthProvider } from "../src/auth/auth-context";

import "./styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
