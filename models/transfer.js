import responseProtheus from "adapters/api-protheus/response";
import apiProtheus from "infra/provider/api-protheus";

async function runInsertAPIProtheus(data) {
  const results = await apiProtheus.execute.transfer.create(data);

  return results;
}

async function findAll(tokenProtheus, params) {
  const response = await apiProtheus.execute.transfer.read({
    tokenProtheus,
    params,
  });

  const results = await responseProtheus.execute.parseTransfer(response);

  return results;
}

async function create(tokenProtheus, transferInputValues, params) {
  const dataObject = {
    spools: transferInputValues.spools,
    fornecedor: {
      origem: String(transferInputValues?.supplier_origin),
      destino: String(transferInputValues?.supplier_destination),
    },
    processo: String(transferInputValues?.process),
    aet: String(transferInputValues?.third),
  };
  /*
  "spools": ["SP0414FL005001", "SP0313FL005002"],
  "processo":"AC",
  "fornecedor": {
    "origem": "003385",
    "destino": "004449"
  },
  "aet": "S" | "N"
  */

  const response = await runInsertAPIProtheus({
    data: dataObject,
    tokenProtheus,
    params,
  });

  return response;
}

const transfer = {
  findAll,
  create,
};

export default transfer;
