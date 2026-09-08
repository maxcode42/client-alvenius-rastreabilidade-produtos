import responseProtheus from "adapters/api-protheus/response";
import apiProtheus from "infra/provider/api-protheus";

async function runInsertAPIProtheus(data) {
  const results = await apiProtheus.execute.transfer.process.create(data);

  return results;
}

async function findAll(tokenProtheus, params) {
  const response = await apiProtheus.execute.transfer.process.read({
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
