import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "../../src/auth/auth-context";

import Header from "../../components/header";
import Input from "components/ui/input";
import Button from "components/ui/button";

export default function Login() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    await signIn({ id: 1, role: "user" }); // 🔑 muda estado global
  }

  //if (loading) return null;

  return (
    <div className="w-full h-full bg-zinc-100 overflow-hidden ">
      <Header />
      <div className="overflow-hidden flex flex-col w-full h-full py-16 justify-center items-center px-4">
        <form className="flex flex-col w-full sm:w-1/2 lg:w-1/3 p-4 gap-8 justify-center border-blue-950/50 border-2 rounded-sm">
          <section className="flex flex-col w-full items-center gap-4">
            <h2 className="text-2xl font-semibold text-blue-900">Login</h2>
            <p className="text-sm">
              Enter com seu código e senha para continuar.
            </p>
          </section>
          <section className="flex flex-col w-full gap-4">
            <Input
              id="code"
              type="text"
              value=""
              label="Código"
              placeholder="0000000"
              onChange={() => {}}
            />
            <Input
              id="code"
              type="password"
              value=""
              label="Senha"
              placeholder=""
              onChange={() => {}}
            />
          </section>
          <section className="w-full">
            <Button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "ENTRAR"
              )}
            </Button>
          </section>
          <section className="flex flex-col w-full mt-4">
            <p className="flex flex-row items-center justify-end text-left text-stone-400 w-full text-sm">
              v0.0.1
            </p>
          </section>
        </form>
      </div>
    </div>
  );
}
