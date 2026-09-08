import ProcessTransferComponentCreate from "components/container/process-transfer/component/create/";

import { PROCESS_FLOW } from "../../../../types/process-flow";

import withAuth from "auth/auth-with";

function TransferComponentCreate() {
  return (
    <ProcessTransferComponentCreate
      title={"Transfêrencia"}
      route={PROCESS_FLOW.route.component.name}
      textModal={"Realiza registro Componentes para transferência."}
      info={"Criar o registro do processo de transferência."}
    />
  );
}

export default withAuth(TransferComponentCreate);
