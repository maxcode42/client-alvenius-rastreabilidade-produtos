import apiProtheus from "infra/provider/api-protheus";
// import responseProtheus from "adapters/api-protheus/response";

import { normalizeAlphanumeric } from "../util/formatters/text";

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.execute.component.find({
    tokenProtheus,
    params: formatCode,
  });

  // const results = await responseProtheus.execute.parse({ objects: [response] });
  const results = {
    codigo: response?.codigo,
    descricao: response?.descricao,
  };

  return { data: [results] };
}

const component = {
  findOnByCode,
};

export default component;
