import apiProtheus from "infra/provider/api-protheus";
import responseProtheus from "adapters/api-protheus/response";

import { normalizeAlphanumeric } from "../util/formatters/text";

async function findAll(tokenProtheus) {
  const response = await apiProtheus.execute.boilermaking.read({
    tokenProtheus,
  });

  const results = await responseProtheus.execute.parse(response);

  return results;
}

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.execute.boilermaking.find({
    tokenProtheus,
    params: formatCode,
  });

  const results = await responseProtheus.execute.parse({ objects: [response] });

  return results;
}

async function create(data, tokenProtheus) {
  const response = await apiProtheus.execute.boilermaking.create({
    data,
    tokenProtheus,
  });

  return response;
}

const boilermaking = {
  findOnByCode,
  findAll,
  create,
};

export default boilermaking;
