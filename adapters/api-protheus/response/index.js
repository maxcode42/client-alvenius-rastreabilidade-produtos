import { PROCESS_STATUS } from "types/process-status";
import { PROCESS_FLOW } from "types/process-flow";

import { normalizeAlphanumeric } from "../../../util/formatters/text";

/*
    : {
      name: "execução",
      description:  "(em processo produção)"
    },
    : {
      name: "pausado", 
      description: "(aguardando para continuar)"
    },
    finished: {
      name: "finalizado",
      description:  `(aguardando "Aprova CQ")`
    },
 
*/
const PROCESS_DESCRIPTION = {
  reserved: {
    name: "reservado",
    description: "(aguardando incio)",
  },
  execution: {
    name: "execução",
    description: "(em processo produção)",
  },
  paused: {
    name: "pausado",
    description: "(aguardando para continuar)",
  },
  finished: {
    name: "finalizado",
    description: `(aguardando "Aprova CQ")`,
  },
  relocation: {
    name: "romaneio",
    description: "(aguardando proxima etapa)",
  },
};

// const PROCESS_DESCRIPTION = {
//   reserved: "(aguardando incio)",
//   execution: "(em processo produção)",
//   paused: "(aguardando para continuar)",
//   finished: `(aguardando "Aprova CQ")`,
//   relocation: "(aguardando proxima etapa)",
// };

const execute = {
  parse: async (data) => {
    const objects = data?.objects ?? [];

    // const results = objects.map((item) => {
    //   return {
    //     sequence: item?.SEQ ?? "",
    //     codigo: normalizeAlphanumeric(item?.COD?.trim()) ?? "",
    //     status: PROCESS_STATUS.name[item?.STATUS?.trim()] ?? "",
    //     status_sigle: item?.STATUS?.trim() ?? "",
    //     dateStart: item?.DTINIC?.trim() ?? "",
    //     timeStart: item?.HRINIC?.trim() ?? "",
    //     dateEnd: item?.DTSAID?.trim() ?? "",
    //     timeEnd: item?.HRSAID?.trim() ?? "",
    //     user: item?.USER?.trimStart()?.trimEnd() ?? "",
    //     process: PROCESS_FLOW.name[item?.PROCES?.trim()] ?? "",
    //     process_sigle: item?.PROCES?.trim() ?? "",
    //     descricao: item?.DESCRI ?? "",
    //   };
    // });

    const results = objects.reduce(
      (acc, item) => {
        if (acc.quantities.length === 0) {
          for (const key in PROCESS_DESCRIPTION) {
            const status = PROCESS_DESCRIPTION[key];

            acc.quantities.push({
              name: status.name,
              description: status.description,
              quantity: 0,
            });
          }
        }

        const formattedItem = {
          sequence: item?.SEQ ?? "",
          codigo: normalizeAlphanumeric(item?.COD?.trim()) ?? "",
          status: PROCESS_STATUS.name[item?.STATUS?.trim()] ?? "",
          status_sigle: item?.STATUS?.trim() ?? "",
          dateStart: item?.DTINIC?.trim() ?? "",
          timeStart: item?.HRINIC?.trim() ?? "",
          dateEnd: item?.DTSAID?.trim() ?? "",
          timeEnd: item?.HRSAID?.trim() ?? "",
          user: item?.USER?.trim() ?? "",
          process: PROCESS_FLOW.name[item?.PROCES?.trim()] ?? "",
          process_sigle: item?.PROCES?.trim() ?? "",
          descricao: item?.DESCRI ?? "",
        };

        acc.data.push(formattedItem);
        acc.total++;

        const status = formattedItem.status?.toLowerCase();

        if (status) {
          for (let i = 0; i < acc.quantities.length; i++) {
            if (acc.quantities[i].name === status) {
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

    // console.log("===========================================");
    // console.log(results);
    // console.log("===========================================");
    return results;
  },
};

const responseProtheus = {
  execute,
};

export default responseProtheus;

/*
CONTEXTO: preciso percorre um array de itens e retornar dados formatado no array de objetos "items" 
adicionando o "quantities" outro array de objetos conteúdo do "PROCESS_DESCRIPTION" usando 
como base para gerar nome das variáveis no objeto "quantities" e ordenando segundo ordem do "PROCESS_DESCRIPTION"
e no final do objeto "objectItens" adicionar total de itens dentro do objeto "items".
segue dados modelo base:
"
  const PROCESS_DESCRIPTION = {
    reservado: {
      name: "reservado",
      description: "(aguardando incio)"
    },
    execution: {
      name: "execução",
      description:  "(em processo produção)"
    },
    paused: {
      name: "pausado", 
      description: "(aguardando para continuar)"
    },
    finished: {
      name: "finalizado",
      description:  `(aguardando "Aprova CQ")`
    },
    romaneio: {
      name: "romaneio", 
      description: "(aguardando proxima etapa)"
    }
  };


const objectItens = [{
  items: [{
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
  }]
  quantities: [{
   name: status,
    description: PROCESS_DESCRIPTION[status],
    quantity: counts?.[status] || 0,
  }]
  total: 20
]}"
*/
