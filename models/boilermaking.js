import apiProtheus from "infra/provider/api-protheus";
import { PROCESS_FLOW } from "types/process-flow";
import { PROCESS_STATUS } from "types/process-status";

function normalizeAlphanumeric(text) {
  return text.replace(/[^A-Za-z0-9]/g, "").trim();
}

async function handlerObject(data) {
  //const statusArray = Object.keys(PROCESS_STATUS.name);

  const results = await data?.objects.map((item) => {
    // const statusAcronym =
    //   statusArray[Math.floor(Math.random() * statusArray.length)];
    // console.log(data);
    // if (item?.COD?.trim() === "SP0415003450") {
    return {
      sequence: item?.SEQ,
      codigo: normalizeAlphanumeric(item?.COD?.trim()),
      status: PROCESS_STATUS.name[item?.STATUS?.trim()], //PROCESS_STATUS.name[statusAcronym],
      status_sigle: item?.STATUS?.trim(), //statusAcronym,statusAcronym, //
      dateStart: item?.DTINIC?.trim(), //item?.DTENTR?.trim(),
      timeStart: item?.HRINIC?.trim(),
      dateEnd: item?.DTSAID?.trim(),
      timeEnd: item?.HRSAID?.trim(),
      user: item?.USER?.trimStart()?.trimEnd(),
      process: PROCESS_FLOW.name[item?.PROCES?.trim()],
      process_sigle: item?.PROCES?.trim(),
      descricao: item?.DESC_QUALID ?? "", //"CALDEIRARIA: TESTES descrição produto",
    };
  });

  return results;
}

async function findAll(tokenProtheus) {
  const response = await apiProtheus.execute.boilermaking.read({
    tokenProtheus,
  });

  const results = await handlerObject(response);

  return results;
}

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.execute.boilermaking.find({
    tokenProtheus,
    params: formatCode,
  });

  const results = await handlerObject({ objects: [response] });

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
