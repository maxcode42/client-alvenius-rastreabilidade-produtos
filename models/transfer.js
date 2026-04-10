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
    fornecedor: String(transferInputValues?.supplier),
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
