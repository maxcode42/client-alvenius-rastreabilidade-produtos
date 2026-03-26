import withAuth from "../../auth/auth-with";

import { PROCESS_FLOW } from "types/process-flow";

import ProcessRegister from "components/container/process-register";

function Register() {
  return (
    <ProcessRegister
      title={"Cadastro"}
      route={PROCESS_FLOW.route.register.name}
      textModal={"Realiza o cadastro de Spool e componentes."}
      info={
        "Realiza o cadastro de Spool e componentes iniciar processo produção."
      }
    />
  );
}

export default withAuth(Register);
