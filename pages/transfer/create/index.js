import ProcessTransferCreate from "components/container/process-transfer/create/[params]";

import { PROCESS_FLOW } from "../../../types/process-flow";

import withAuth from "auth/auth-with";

function TransferCreate() {
  return (
    <ProcessTransferCreate
      title={"Romaneio"}
      route={PROCESS_FLOW.route.transfer.name}
      textModal={"Realiza registro Spool para romaneio."}
      info={"Criar o registro do processo de romaneio."}
    />
  );
}

export default withAuth(TransferCreate);
