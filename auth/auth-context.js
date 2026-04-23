"use client";

import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import AlertCustom from "components/ui/alert";

import { STATUS_CODE } from "types/status-code";
import { AUTH_EVENTS } from "./auth-events";

import { useQRCode } from "hooks/qr-code-context";

import api from "infra/provider/api-web";

const AuthContext = createContext(null);

const fetchUser = async () => {
  const result = await api?.execute?.user?.read();

  if (result.status_code === STATUS_CODE.UNAUTHORIZED) {
    const error = new Error(result.message || "Unauthorized");
    error.status = result.status_code;
    throw error;
  }

  return result;
};

export function AuthProvider({ children }) {
  const currentRoute = usePathname();
  const { setMessage, setOpenAlert } = useQRCode();
  const router = useRouter();

  const [openAlertAuth, setOpenAlertAuth] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);

  const pagesPublic = useMemo(() => ["/login", "/status"], []);

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
    const result = await api.execute.session.create({
      data: { username, password },
    });

    // if (result?.status_code === STATUS_CODE.SERVER_ERROR) {
    if (
      result?.status_code !== STATUS_CODE.UNAUTHORIZED &&
      result?.status_code !== STATUS_CODE.CREATE &&
      !result?.token
    ) {
      setMessage(`${result.action} ${result.message}`);
      setOpenAlertError(true);
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
    setHasAuthenticated(false);
    await mutate(null, false);

    router.replace("/login");
  }

  async function signOut() {
    await api.execute.session.delete();
    await clearLogout();
  }

  useEffect(() => {
    function handleUnauthorized() {
      if (
        (!shouldFetch && !hasAuthenticated) ||
        (!hasAuthenticated && currentRoute === "/")
      ) {
        return;
      }

      setMessage("Sessão expirou. Faça login novamente.");
      setOpenAlertAuth(true);
      setOpenAlert(true);
      //}
    }
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, shouldFetch, hasAuthenticated, currentRoute]);

  if (openAlertAuth && !pagesPublic.includes(currentRoute)) {
    return (
      <AlertCustom
        action={null}
        actionClose={() => {
          clearLogout();
          setOpenAlertAuth(false);
        }}
        title="Informação"
        type="info"
      />
    );
  }

  if (openAlertError && currentRoute === "/login") {
    return (
      <AlertCustom
        action={null}
        actionClose={() => setOpenAlertError(false)}
        title="Informação"
        type="info"
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
