import responseProtheus from "adapters/api-protheus/response";
import apiProtheus from "infra/provider/api-protheus";

import { normalizeAlphanumeric } from "../util/formatters/text";

async function findAll(tokenProtheus) {
  const response = await apiProtheus.execute.painting.read({
    tokenProtheus,
  });

  const results = await responseProtheus.execute.parse(response);

  return results;
}

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.execute.painting.find({
    tokenProtheus,
    params: formatCode,
  });

  const results = await responseProtheus.execute.parse({ objects: [response] });

  return results;
}

async function create(data, tokenProtheus) {
  const response = await apiProtheus.execute.painting.create({
    data,
    tokenProtheus,
  });

  return response;
}

const painting = {
  findOnByCode,
  findAll,
  create,
};

export default painting;
