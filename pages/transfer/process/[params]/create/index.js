import ProcessTransferCreate from "../../../../../components/container/process-transfer/process/[params]/create";

import { PROCESS_FLOW } from "../../../../../types/process-flow";

import withAuth from "../../../../../auth/auth-with";

function TransferProcessCreate() {
  return (
    <ProcessTransferCreate
      title={"Transfêrencia"}
      route={PROCESS_FLOW.route.transfer.name}
      textModal={"Realiza registro Spool para transferência."}
      info={"Criar o registro do processo de transferência."}
    />
  );
}

export default withAuth(TransferProcessCreate);
