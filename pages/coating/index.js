import withAuth from "../../auth/auth-with";

import { PROCESS_FLOW } from "types/process-flow";

import ProcessFlow from "components/container/process-flow";

function Coating() {
  return (
    <ProcessFlow
      title={"Revestimento"}
      route={PROCESS_FLOW.route.coating.name}
      textModal={"para buscar o SPOOL e seguir fluxo do"}
      info={"Leitura Spool, iniciar, finalizar e executar processo produção."}
    />
  );
}

export default withAuth(Coating);
