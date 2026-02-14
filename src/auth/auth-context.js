import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";
import { STATUS_CODE } from "types/status-code";
import api from "provider/api-web";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const currentRoute = usePathname();

  const fetchGetUser = useCallback(async () => {
    const results = await api.getUser();

    if (results.status_code !== STATUS_CODE.UNAUTHORIZED && results?.id) {
      setUser({ id: results.id, username: results.username });
    }

    setLoading(false);

    return results;
  }, []);

  const CheckLogin = useCallback(async () => {
    const pagesPublic = ["/login", "/status"];

    if (pagesPublic.includes(currentRoute) || user !== null) {
      setLoading(false);
      return;
    }

    if (!pagesPublic.includes(currentRoute)) {
      await fetchGetUser();
    }
  }, [fetchGetUser, currentRoute, user]);

  async function signIn({ username, password }) {
    setLoading(true);

    let results = await api.createSession({ username, password });

    if (results.status_code !== STATUS_CODE.UNAUTHORIZED) {
      results = await fetchGetUser();
    }

    setLoading(false);

    return results;
  }

  async function signOut() {
    const results = await api.deleteSession();

    if (results.status !== STATUS_CODE.UNAUTHORIZED) {
      setUser(null);
    }
  }

  useEffect(() => {
    CheckLogin();
  }, [CheckLogin]);

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
