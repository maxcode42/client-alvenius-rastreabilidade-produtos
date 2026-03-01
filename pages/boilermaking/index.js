import withAuth from "../../auth/auth-with";
import ProcessFlow from "components/container/process-flow";

function Boilermaking() {
  return (
    <ProcessFlow
      title={"Caldeiraria"}
      route={"boilermaking"}
      textModal={"para buscar o SPOOL e seguir fluxo do"}
      info={"Leitura Spool, iniciar, finalizar e executar processo produção."}
    />
  );
}

export default withAuth(Boilermaking);
