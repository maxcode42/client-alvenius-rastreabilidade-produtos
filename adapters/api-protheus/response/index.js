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
          painting: item.PINTURA,
        };
        return formattedItem;
      }) || [];

    // console.log("API PARSED");
    // console.log(results);

    return results;
  },
  parseTransfer: async (data) => {
    console.log(">>API PROTHEUS TRANSFER PARSE OBJECTS");

    console.log(data);
    if (!data || !data?.objects || data?.objects.length === 0) {
      return {
        status_list: [],
        results: [],
      };
    }
    // const statusActive = ["SC", "AP", "AN", "NT"];

    // function getRandomProgressive() {
    //   if (!statusActive?.length) return [];

    //   const index = Math.floor(Math.random() * statusActive.length);

    //   const results = statusActive.slice(0, index + 1);

    //   return results;
    // }

    // function formatStatus(item) {
    //   // const status = item?.map((i) => {
    //   //   return {
    //   //     acronym: i?.SIGLA,
    //   //     status_text: i?.STATUS,
    //   //   };
    //   // });

    //   // return status;
    //   const status = item?.map((i) => {
    //     return i?.SIGLA;
    //   });

    //   return status;
    // }

    function formatStatusRandom(item) {
      // const status = item?.map((i) => {
      //   return {
      //     acronym: i?.SIGLA,
      //     status_text: i?.STATUS,
      //   };
      // });

      // return status;
      const results = item?.map((i) => i?.acronym);

      return results;
    }

    function formatObjectStatusList(item) {
      // const status = [
      //   {
      //     acronym: item?.SIGLA1,
      //     text: item?.STATUS1,
      //   },
      //   {
      //     acronym: item?.SIGLA2,
      //     text: item?.STATUS2,
      //   },
      //   {
      //     acronym: item?.SIGLA3,
      //     text: item?.STATUS3,
      //   },
      //   {
      //     acronym: item?.SIGLA4,
      //     text: item?.STATUS4,
      //   },
      //   {
      //     acronym: item?.SIGLA5,
      //     text: item?.STATUS5,
      //   },
      // ];

      const results = item
        .sort((a, b) => a.ORDEM - b.ORDEM)
        .map((i) => ({
          acronym: i?.SIGLA,
          order: i.ORDEM,
          text: i?.STATUS,
        }));

      return results;
    }

    function getRandomProgressive(statusActive) {
      // console.log(statusActive);

      if (!statusActive?.length) return [];

      const index = Math.floor(Math.random() * statusActive.length);

      const results = statusActive.slice(0, index + 1);

      return results;
    }

    const status_list = formatObjectStatusList(data?.STATUS_LIST);

    const results =
      data?.objects?.map((item) => {
        const formattedItem = {
          code: item.CODIGO,
          spools: item.SPOOLS,
          supplier: {
            origin: {
              code:
                item?.COD_FORNEC?.trim().length > 0
                  ? item?.COD_FORNEC?.trim()
                  : "--------",
              name:
                item?.NOME_FORNEC?.trim().length > 0
                  ? item?.NOME_FORNEC?.trim().concat(" TESTE NOME MUITO GRANDE")
                  : "----------",
              store:
                item?.LOJA_FORNEC?.trim().length > 0
                  ? item?.LOJA_FORNEC?.trim()
                  : "----",
            },
            destination: {
              code:
                item?.COD_FORNEC?.trim().length > 0
                  ? item?.COD_FORNEC?.trim()
                  : "--------",
              name:
                item?.NOME_FORNEC?.trim().length > 0
                  ? item?.NOME_FORNEC?.trim()
                  : "----------",
              store:
                item?.LOJA_FORNEC?.trim().length > 0
                  ? item?.LOJA_FORNEC?.trim()
                  : "----",
            },
          },
          number_sc: item.NUM_SC,
          order: item.PEDIDO,
          romaneio: item.ROMANEIO,
          revision: item.REVISAO,
          aet: item.AET,
          process: item.PROCESSO,
          status: getRandomProgressive(formatStatusRandom(status_list)), //formatStatus(item.STATUS), //getRandomProgressive(), //"Aguardando SC",
        };
        return formattedItem;
      }) || [];

    // console.log("API PARSED RESULTS PROTHEUS");
    // console.log(data);
    // console.log("API PARSED");
    // console.log(results);

    return { status_list, results };
  },
};

const responseProtheus = {
  execute,
};

export default responseProtheus;
