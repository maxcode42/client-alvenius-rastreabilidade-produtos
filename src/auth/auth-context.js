import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  async function signIn(userData) {
    setLoading(true);

    localStorage.setItem(
      "auth-token-rastreabilidade",
      JSON.stringify(userData),
    );

    setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 600);
  }

  function signOut() {
    localStorage.removeItem("auth-token-rastreabilidade");

    setTimeout(() => {
      setUser(null);
    }, 600);
  }

  useEffect(() => {
    const token = localStorage.getItem("auth-token-rastreabilidade");

    if (token) {
      signIn({ id: 1, role: "user" });
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("Error: userAuth must be used inside AuthProvider");
  }

  return ctx;
}
