"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";

import { STATUS_CODE } from "types/status-code";
import api from "provider/api-web";
import AlertInfo from "components/ui/alert/info";

const AuthContext = createContext(null);

const fetchUser = async () => {
  const result = await api.getUser();

  if (result.status_code === STATUS_CODE.UNAUTHORIZED) {
    const error = new Error(result.message || "Unauthorized");
    error.status = result.status_code;
    throw error;
  }

  return result;
};

export function AuthProvider({ children }) {
  const currentRoute = usePathname();
  const router = useRouter();

  const pagesPublic = useMemo(() => ["/login", "/status"], []);

  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);

  const shouldFetch = !pagesPublic.includes(currentRoute); //&& refreshInterval > 0;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? "/user" : null,
    fetchUser,
    {
      refreshInterval: refreshInterval || 0,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    },
  );

  const user = data?.id ? { id: data.id, username: data.username } : null;

  const loading = shouldFetch ? isLoading : false;

  function getRefreshInterval(expiresAt) {
    if (!expiresAt) return 0;

    const expirationTime = new Date(expiresAt).getTime();
    const now = Date.now();

    const diff = expirationTime - now;

    return diff > 0 ? diff : 0;
  }

  async function signIn({ username, password }) {
    const result = await api.createSession({ username, password });

    if (result?.status_code === STATUS_CODE.SERVER_ERROR) {
      setMessage(`${result.action} ${result.message}`);
      setOpenAlert(true);
      return result;
    }

    if (result?.expires_at) {
      const interval = getRefreshInterval(result?.expires_at);

      setRefreshInterval(interval);
      setHasAuthenticated(true);

      await mutate(
        {
          id: result.id,
          username: result.username,
        },
        false,
      );

      router.replace("/");
    }

    return result;
  }

  async function clearLogout() {
    setRefreshInterval(0);
    setHasAuthenticated(true);
    await mutate(null, false);
    router.push("/login");
  }

  async function signOut() {
    await api.deleteSession();
    await clearLogout();
  }

  useEffect(() => {
    if (!shouldFetch) return;

    if (hasAuthenticated && error?.status === STATUS_CODE.UNAUTHORIZED) {
      setMessage("Sessão expirou. Faça login novamente.");
      setOpenAlert(true);
    }
  }, [error, shouldFetch, hasAuthenticated]);

  if (openAlert && !pagesPublic.includes(currentRoute)) {
    return (
      <AlertInfo
        message={message}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setScannerLocked={() => {}}
        action={clearLogout}
      />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
