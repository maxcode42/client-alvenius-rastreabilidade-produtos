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
};

const responseProtheus = {
  execute,
};

export default responseProtheus;
