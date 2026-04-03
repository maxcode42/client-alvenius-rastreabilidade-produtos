import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";

import { normalizeAlphanumeric } from "../../../util/formatters/text";

const execute = {
  parse: async (data) => {
    const objects = data?.objects ?? [];

    const results = objects.reduce(
      (acc, item) => {
        if (acc.quantities.length === 0) {
          for (const key in PROCESS_STATUS.acronym) {
            const status = PROCESS_STATUS.acronym[key];

            acc.quantities.push({
              status_acronym: status,
              name: PROCESS_STATUS.name[status],
              description: PROCESS_STATUS.description[key],
              quantity: 0,
            });
          }
        }

        const formattedItem = {
          sequence: item?.SEQ ?? "",
          codigo: normalizeAlphanumeric(item?.COD?.trim()) ?? "",
          status: PROCESS_STATUS.name[item?.STATUS?.trim()] ?? "",
          status_acronym: item?.STATUS?.trim() ?? "",
          dateStart: item?.DTINIC?.trim() ?? "",
          timeStart: item?.HRINIC?.trim() ?? "",
          dateEnd: item?.DTSAID?.trim() ?? "",
          timeEnd: item?.HRSAID?.trim() ?? "",
          user: item?.USER?.trim() ?? "",
          process: PROCESS_FLOW.name[item?.PROCES?.trim()] ?? "",
          process_acronym: item?.PROCES?.trim() ?? "",
          descricao: item?.DESCRI ?? "",
        };

        acc.data.push(formattedItem);
        acc.total++;

        const status = formattedItem.status_acronym;

        if (status) {
          for (let i = 0; i < acc.quantities.length; i++) {
            if (acc.quantities[i].status_acronym === status) {
              acc.quantities[i].quantity++;
              break;
            }
          }
        }

        return acc;
      },
      {
        data: [],
        quantities: [],
        total: 0,
      },
    );

    return results;
  },
  parseSupplier: async (data) => {
    const results =
      data?.objects?.map((item) => {
        const formattedItem = {
          code: item.CODIGO,
          store: item.LOJA,
          name: item.NOME,
          boolikings: item.CALDERARIA,
          coating: item.REVESTIMENTO,
          pincture: item.PINCTURE,
        };
        return formattedItem;
      }) || [];

    console.log("API PARSED");
    console.log(results);

    return results;
  },
  parseTransfer: async (data) => {
    console.log(">>API PROTHEUS TRANSFER PARSE OBJECTS");
    console.log(data);

    const statusActive = ["SC", "AP", "AN", "NT"];

    function getRandomProgressive() {
      if (!statusActive?.length) return [];

      const index = Math.floor(Math.random() * statusActive.length);

      const results = statusActive.slice(0, index + 1);

      return results;
    }

    const results =
      data?.objects?.map((item) => {
        const formattedItem = {
          code: item.CODIGO,
          spools: item.SPOOLS,
          supplier: item.FORNECEDOR,
          store: item.LOJA,
          number_sc: item.NUM_SC,
          order: item.PEDIDO,
          romaneio: item.ROMANEIO,
          revision: item.REVISAO,
          aet: item.AET,
          process: item.PROCESSO,
          status: getRandomProgressive(), //"Aguardando SC",
        };
        return formattedItem;
      }) || [];

    console.log("API PARSED");
    console.log(results);

    return results;
  },
};

const responseProtheus = {
  execute,
};

export default responseProtheus;
