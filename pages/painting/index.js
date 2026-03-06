import withAuth from "../../auth/auth-with";

import { PROCESS_FLOW } from "types/process-flow";

import ProcessFlow from "components/container/process-flow";

function Painting() {
  return (
    <ProcessFlow
      title={"Pintura"}
      route={PROCESS_FLOW.route.painting.name}
      textModal={"para buscar o SPOOL e seguir fluxo do"}
      info={"Leitura Spool, iniciar, finalizar e executar processo produção."}
    />
  );
}

export default withAuth(Painting);
