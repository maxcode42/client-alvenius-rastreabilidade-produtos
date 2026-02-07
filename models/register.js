//import database from "infra/database";
//import password from "models/password";
//import { ValidationError, NotFoundError } from "infra/errors";
import apiProtheus from "provider/api-protheus";

async function runInsertAPIProtheus(registerInputValues) {
  const results = await apiProtheus.createRegister(registerInputValues);

  return results[0];
}

async function create(registerInputValues) {
  const componentes = registerInputValues?.itens?.map((item) => ({
    COD_PRODUTO: item?.codigo,
    DESC: item?.descricao,
    COD_FORNEC: item?.fornecedor,
    CORRIDA: item?.fluxo,
  }));

  const registerObject = {
    QrCode: {
      SPOOL: registerInputValues?.spool?.codigo,
      DESC: registerInputValues?.spool?.descricao,
      Componentes: componentes,
    },
  };

  const result = await runInsertAPIProtheus({ data: registerObject });

  return result;
}

const register = {
  create,
};

export default register;
