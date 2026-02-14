import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import { LockKeyhole, User2Icon } from "lucide-react";

import { STATUS_CODE } from "types/status-code";
import { useAuth } from "../../src/auth/auth-context";

import Body from "../../components/body";
import Header from "../../components/header";
import Input from "components/ui/input";
import Button from "components/ui/button";

export default function Login() {
  const router = useRouter();
  const isFirstLoad = useRef(true);
  const { user, loading, signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handlerRouterPage = useCallback(() => {
    router.push("/");
  }, [router]);

  async function handleSendLogin(e) {
    e.preventDefault();

    if (loading) return;

    if (ValidatesFields()) {
      return;
    }

    const response = await signIn({ username, password });

    if (response.status_code === STATUS_CODE.UNAUTHORIZED) {
      setUsernameMessage(`${response.message}`);
      setPasswordMessage(`${response.action}`);
    }

    if (response.status === STATUS_CODE.CREATE) {
      handlerRouterPage();
    }
  }

  const ValidatesFields = useCallback(() => {
    if (username.length > 0) {
      setUsernameMessage("");
    }

    if (password.length > 0) {
      setPasswordMessage("");
    }
    if (username.length === 0) {
      setUsernameMessage("Usuário deve conter formato valido!");
    }

    if (password.length === 0) {
      setPasswordMessage("Campo senha não pode ser vazio!");
    }

    return username.length === 0 || password.length === 0;
  }, [username, password]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }

    !isFirstLoad.current ?? ValidatesFields();
  }, [loading, user, router, isFirstLoad, ValidatesFields]);

  //if (loading) return null;

  return (
    <div className="w-full h-full bg-zinc-100 overflow-hidden">
      <Header />

      <Body>
        <div className="overflow-hidden flex flex-col w-full h-full py-6 md:mt-16 justify-center items-center px-4">
          <form className="flex flex-col w-full sm:w-1/2 lg:w-1/3 p-4 gap-8 justify-center border-blue-950/50 border-2 rounded-sm">
            <section className="flex flex-col w-full items-center gap-4">
              <h2 className="text-2xl font-semibold text-blue-900">Login</h2>
              <p className="text-sm">
                Enter com seu usuário e senha para continuar.
              </p>
            </section>
            <section className="flex flex-col w-full gap-4">
              <div className="flex flex-col">
                <Input
                  id="code"
                  type="text"
                  value={username}
                  label="Usuário"
                  placeholder="digite seu nome de usuário"
                  onChange={(e) => setUsername(e.target.value)}
                >
                  <User2Icon className="text-stone-400 mr-2" size={18} />
                </Input>
                <span
                  className={`py-1 h-7 min-h-7 text-sm text-red-500 transition-all ${usernameMessage.length > 0 ? "" : "hidden translate-y-9"}`}
                >
                  {"* "}
                  {usernameMessage}
                </span>
              </div>
              <div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  label="Senha"
                  placeholder="digite sua senha"
                  onChange={(e) => setPassword(e.target.value)}
                >
                  <LockKeyhole
                    className="text-stone-400 mr-2 mt-0.5"
                    size={18}
                  />
                </Input>
                <span
                  className={`py-1 h-7 min-h-7 text-sm text-red-500 transition-all ${passwordMessage.length > 0 ? "" : "hidden translate-y-9"}`}
                >
                  {"* "}
                  {passwordMessage}
                </span>
              </div>
            </section>
            <section className="w-full">
              <Button
                type="button"
                onClick={handleSendLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </section>
            <section className="flex flex-col w-full mt-4">
              <p className="flex flex-row items-center justify-end text-left text-stone-400 w-full text-sm">
                <small>
                  &#174; {new Date().getFullYear()} -{" "}
                  <Link
                    target="_blank"
                    href="https://alvenius.ind.br/"
                    alt="Link site alvenius tubos e conexões"
                    className="text-sm border-b-2 border-transparent transition-all duration-300 hover:border-stone-500 hover:text-stone-500 cursor-pointer"
                  >
                    Alvenius Tubos e Conexões
                  </Link>
                  - {process.env.NEXT_PUBLIC_APP_VERSION}
                </small>
              </p>
            </section>
          </form>
        </div>
      </Body>
    </div>
  );
}
