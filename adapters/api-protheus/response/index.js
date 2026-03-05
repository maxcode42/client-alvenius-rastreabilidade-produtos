import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";

import { normalizeAlphanumeric } from "../../../util/formatters/text";

const execute = {
  parse: async (data) => {
    const objects = data?.objects ?? [];

    const results = objects.map((item) => {
      return {
        sequence: item?.SEQ ?? "",
        codigo: normalizeAlphanumeric(item?.COD?.trim()) ?? "",
        status: PROCESS_STATUS.name[item?.STATUS?.trim()] ?? "",
        status_sigle: item?.STATUS?.trim() ?? "",
        dateStart: item?.DTINIC?.trim() ?? "",
        timeStart: item?.HRINIC?.trim() ?? "",
        dateEnd: item?.DTSAID?.trim() ?? "",
        timeEnd: item?.HRSAID?.trim() ?? "",
        user: item?.USER?.trimStart()?.trimEnd() ?? "",
        process: PROCESS_FLOW.name[item?.PROCES?.trim()] ?? "",
        process_sigle: item?.PROCES?.trim() ?? "",
        descricao: item?.DESCRI ?? "",
      };
    });

    return results;
  },
};

const responseProtheus = {
  execute,
};

export default responseProtheus;
