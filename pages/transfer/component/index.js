import ProcessTransferComponentFlow from "components/container/process-transfer/component/[params]";

import { PROCESS_FLOW } from "types/process-flow";

import withAuth from "../../../auth/auth-with";

function TransferComponent() {
  return (
    <ProcessTransferComponentFlow
      title={"Transferência - Componente"}
      route={PROCESS_FLOW.route.transfer.name}
      textModal={"Lista os registros Spool de transferência."}
      info={"Lista e criar o registro do processo de transferência."}
    />
  );
}

export default withAuth(TransferComponent);
