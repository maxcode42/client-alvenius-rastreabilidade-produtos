import Link from "next/link";
import { useState, useCallback } from "react";
import { LockKeyhole, LogInIcon, User2Icon } from "lucide-react";

import LayoutPage from "components/layout-page";
import Input from "components/ui/input";
import Button from "components/ui/button";

import { STATUS_CODE } from "types/status-code";
import { useAuth } from "../../auth/auth-context";

export default function Login() {
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = useCallback(() => {
    let hasError = false;

    if (!username) {
      setUsernameMessage("Usuário deve conter formato válido!");
      hasError = true;
    } else {
      setUsernameMessage("");
    }

    if (!password) {
      setPasswordMessage("Campo senha não pode ser vazio!");
      hasError = true;
    } else {
      setPasswordMessage("");
    }

    return hasError;
  }, [username, password]);

  async function handleSendLogin(e) {
    e.preventDefault();

    if (isSubmitting) return;
    if (validateFields()) return;

    try {
      setIsSubmitting(true);

      const response = await signIn({ username, password });
      if (response.status_code === STATUS_CODE.UNAUTHORIZED) {
        await setUsernameMessage(response?.message || "Usuário inválido");
        await setPasswordMessage(response?.action || "Senha inválida");
        setIsSubmitting(false);

        return;
      }
    } catch (error) {
      setUsernameMessage("Erro ao realizar login.");
      setIsSubmitting(false);
    }
  }

  return (
    <LayoutPage className="overflow-hidden">
      <div className="w-full h-full flex flex-col py-6 px-4 md:mt-16 justify-center items-center">
        <form
          onSubmit={handleSendLogin}
          className="flex flex-col flex-wrap w-full sm:w-1/2 md:w-1/2 lg:w-1/2 max-w-lg 
          p-4 gap-8 justify-center border-blue-950/50 border-2 rounded-sm"
        >
          <section className="flex flex-col w-full items-center gap-4">
            <h2 className="text-2xl font-semibold text-blue-900">Login</h2>
            <p className="text-sm">
              Entre com seu usuário e senha para continuar.
            </p>
          </section>

          <section className="flex flex-col w-full gap-4">
            <div className="flex flex-col">
              <Input
                id="code"
                type="text"
                value={username}
                label="Usuário"
                placeholder="Digite seu nome de usuário"
                onChange={(e) => setUsername(e.target.value)}
              >
                <User2Icon className="text-stone-400 mr-2" size={18} />
              </Input>

              {usernameMessage && (
                <span className="py-1 text-sm text-red-500">
                  * {usernameMessage}
                </span>
              )}
            </div>

            <div>
              <Input
                id="password"
                type="password"
                value={password}
                label="Senha"
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
              >
                <LockKeyhole className="text-stone-400 mr-2 mt-0.5" size={18} />
              </Input>

              {passwordMessage && (
                <span className="py-1 text-sm text-red-500">
                  * {passwordMessage}
                </span>
              )}
            </div>
          </section>

          <section className="w-full">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "disabled:bg-blue-800/50 hover:shadow-blue-600/50" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex flex-row w-full justify-center items-center gap-2">
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Entrando...</span>
                </span>
              ) : (
                <span className="flex flex-row w-full justify-center items-center gap-2">
                  <span className="w-6 h-6">
                    <LogInIcon />
                  </span>
                  <span className="text-xs">ENTRAR</span>
                </span>
              )}
            </Button>
          </section>

          <section className="flex flex-col w-full mt-4">
            <p className="flex items-center justify-end text-stone-400 w-full text-sm">
              <small>
                &#174; {new Date().getFullYear()} -{" "}
                <Link
                  target="_blank"
                  href="https://alvenius.ind.br/"
                  className="border-b-2 border-transparent transition-all duration-300 hover:border-stone-500 hover:text-stone-500"
                >
                  Alvenius Tubos e Conexões -{" "}
                </Link>
                {process.env.NEXT_PUBLIC_APP_VERSION}
              </small>
            </p>
          </section>
        </form>
      </div>
    </LayoutPage>
  );
}
