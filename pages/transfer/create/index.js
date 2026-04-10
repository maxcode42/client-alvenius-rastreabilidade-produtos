import ProcessTransferCreate from "components/container/process-transfer/create/[params]";

import { PROCESS_FLOW } from "../../../types/process-flow";

import withAuth from "auth/auth-with";

function TransferCreate() {
  return (
    <ProcessTransferCreate
      title={"Transfêrencia"}
      route={PROCESS_FLOW.route.transfer.name}
      textModal={"Realiza registro Spool para transferência."}
      info={"Criar o registro do processo de transferência."}
    />
  );
}

export default withAuth(TransferCreate);
