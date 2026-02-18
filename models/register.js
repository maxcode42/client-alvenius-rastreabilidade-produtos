//import database from "infra/database";
//import password from "models/password";
//import { ValidationError, NotFoundError } from "infra/errors";
import apiProtheus from "provider/api-protheus";

async function runInsertAPIProtheus(registerInputValues) {
  const results = await apiProtheus.createRegister(registerInputValues);

  return results[0];
}

function normalizeAlphanumeric(text) {
  return text.replace(/[^A-Za-z0-9]/g, "").trim();
}

function normalizeNumericFloat(text) {
  return Number(String(text).replace(",", "."));
}

async function create(registerInputValues, tokenProtheus) {
  const componentes = registerInputValues?.itens?.map((item) => ({
    COD_PRODUTO: normalizeAlphanumeric(item?.codigo),
    DESC: item?.descricao,
    COD_FORNEC: item?.fornecedor,
    CORRIDA: item?.fluxo,
    QUANT: normalizeNumericFloat(item?.quantidade),
  }));

  const registerObject = {
    QrCode: {
      SPOOL: normalizeAlphanumeric(registerInputValues?.spool?.codigo),
      DESC: registerInputValues?.spool?.descricao,
      Componentes: componentes,
    },
  };

  const result = await runInsertAPIProtheus({
    data: registerObject,
    tokenProtheus,
  });

  return result;
}

const register = {
  create,
};

export default register;
