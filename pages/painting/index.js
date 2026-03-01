import ProcessFlow from "components/container/process-flow";
import withAuth from "../../auth/auth-with";

function Painting() {
  return (
    <ProcessFlow
      title={"Pintura"}
      route={"painting"}
      textModal={"para buscar o SPOOL e seguir fluxo do"}
      info={"Leitura Spool, iniciar, finalizar e executar processo produção."}
    />
  );
}

export default withAuth(Painting);
