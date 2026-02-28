import apiProtheus from "infra/provider/api-protheus";

function getStatus(statusAcronym) {
  const status = {
    RE: () => {
      return "reservado";
    },
    EX: () => {
      return "execução";
    },
    PU: () => {
      return "pausado";
    },
    FI: () => {
      return "finalizado";
    },
    RV: () => {
      return "reversível";
    },
    SU: () => {
      return "sucata";
    },
    RO: () => {
      return "romaneio";
    },
  };

  const ex = status[statusAcronym];

  return ex();
}

function getProcess(processAcronym) {
  const status = {
    CA: () => {
      return "Caldeiraria";
    },
    RR: () => {
      return "Revestimento";
    },
    PP: () => {
      return "Pintura";
    },
    FA: () => {
      return "Faturamento";
    },
  };
  const ex = status[processAcronym];

  return ex();
}

function normalizeAlphanumeric(text) {
  return text.replace(/[^A-Za-z0-9]/g, "").trim();
}

async function handlerObject(data) {
  const statusArray = ["RE", "EX", "PU", "FI", "RV", "SU", "RO"];
  const results = await data?.objects.map((item) => {
    // console.log(">> STATUS NEW");
    // console.log(item?.COD);
    // if (normalizeAlphanumeric(item?.COD) == "SP041500345003") {
    //   console.log(">> STATUS NEW");
    //   console.log(item);
    // }
    const statusAcronym =
      statusArray[Math.floor(Math.random() * statusArray.length)];

    return {
      sequence: item?.SEQ,
      codigo: item?.COD?.trim(),
      status: getStatus(statusAcronym), //getStatus(item?.STATUS?.trim()), //
      status_sigle: statusAcronym, //item?.STATUS?.trim(), //statusAcronym,
      dateStart: item?.DTENTR?.trim(),
      timeStart: item?.HRENT?.trim(),
      dateEnd: item?.DTSAID?.trim(),
      timeEnd: item?.HRSAID?.trim(),
      user: item?.USER?.trimStart()?.trimEnd(),
      // process: item?.PROCESS
      //   ? getProcess(item?.PROCESS?.trim())
      //   : getProcess(item?.PROCES?.trim()),
      process: getProcess(item?.PROCES?.trim()),
      process_sigle: item?.PROCES?.trim(),
      descricao: "TESTES descrição produto",
    };
  });

  return results;
}

async function findAll(tokenProtheus) {
  const response = await apiProtheus.findAllBoilerShop({ tokenProtheus });

  const results = await handlerObject(response);

  return results;
}

async function findOnByCode(tokenProtheus, code) {
  const formatCode = normalizeAlphanumeric(code);

  const response = await apiProtheus.findOnByCode({
    tokenProtheus,
    code: formatCode,
  });

  const results = await handlerObject({ objects: [response] });

  return results;
}

async function create(data, tokenProtheus) {
  console.log(">> MODAL CREATE");
  console.log(data);
  const response = await apiProtheus.createBoilerShop({ data, tokenProtheus });

  return response;
}

const boilerShop = {
  findOnByCode,
  findAll,
  create,
};

export default boilerShop;
