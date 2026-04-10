import responseProtheus from "adapters/api-protheus/response";
import apiProtheus from "infra/provider/api-protheus";

async function findAll(tokenProtheus, params) {
  const response = await apiProtheus.execute.supplier.read({
    tokenProtheus,
    params,
  });

  const results = await responseProtheus.execute.parseSupplier(response);

  return results;
}

const supplier = {
  findAll,
};

export default supplier;
