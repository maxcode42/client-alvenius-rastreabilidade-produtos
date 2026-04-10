import ProcessTransfer from "components/container/process-transfer/[params]";

import { PROCESS_FLOW } from "types/process-flow";

import withAuth from "../../auth/auth-with";

function Transfer() {
  return (
    <ProcessTransfer
      title={"Transferência"}
      route={PROCESS_FLOW.route.transfer.name}
      textModal={"Lista os registros Spool de transferência."}
      info={"Lista e criar o registro do processo de transferência."}
    />
  );
}

export default withAuth(Transfer);
