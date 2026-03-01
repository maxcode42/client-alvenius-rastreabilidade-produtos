import apiProtheus from "infra/provider/api-protheus";
import { PROCESS_FLOW } from "types/process-flow";
import { PROCESS_STATUS } from "types/process-status";

function normalizeAlphanumeric(text) {
  return text.replace(/[^A-Za-z0-9]/g, "").trim();
}

async function handlerObject(data) {
  const statusArray = Object.keys(PROCESS_STATUS.name);
  const results = await data?.objects.map((item) => {
    const statusAcronym =
      statusArray[Math.floor(Math.random() * statusArray.length)];

    return {
      sequence: item?.SEQ,
      codigo: item?.COD?.trim(),
      status: PROCESS_STATUS.name[statusAcronym], //getStatus(item?.STATUS?.trim()), )/
      status_sigle: statusAcronym, //item?.STATUS?.trim(), //statusAcronym,
      dateStart: item?.DTENTR?.trim(),
      timeStart: item?.HRENT?.trim(),
      dateEnd: item?.DTSAID?.trim(),
      timeEnd: item?.HRSAID?.trim(),
      user: item?.USER?.trimStart()?.trimEnd(),
      process: PROCESS_FLOW.name[item?.PROCES?.trim()],
      process_sigle: item?.PROCES?.trim(),
      descricao: "REVESTIMENTO: TESTES descrição produto",
    };
  });

  return results;
}

async function findAll(tokenProtheus) {
  const response = await apiProtheus.execute.coating.read({
    tokenProtheus,
  });

  const results = await handlerObject(response);

  return results;
}

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.execute.coating.find({
    tokenProtheus,
    params: formatCode,
  });

  const results = await handlerObject({ objects: [response] });

  return results;
}

async function create(data, tokenProtheus) {
  const response = await apiProtheus.execute.coating.create({
    data,
    tokenProtheus,
  });

  return response;
}

const coating = {
  findOnByCode,
  findAll,
  create,
};

export default coating;
