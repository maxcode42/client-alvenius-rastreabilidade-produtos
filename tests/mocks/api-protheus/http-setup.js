const crypto = require("node:crypto");

const { STATUS_CODE } = require("../../../types/status-code");

function addHead(_, res, status) {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });
}

function httpSetup({ on }) {
  /* MOCK: STATUS */
  on("GET", "/", async (req, res) => {
    addHead(req, res, STATUS_CODE.SUCCESS);

    res.end(
      JSON.stringify({
        status_code: STATUS_CODE.SUCCESS,
        message: "Status comunicação realizado com api externa.",
      }),
    );
  });

  /* MOCK: SESSION / TOKEN */
  // on("POST", "/api/oauth2/v1/token", async (req, res, { query, body }) => {
  on("POST", "/api/oauth2/v1/token", async (req, res, { query }) => {
    // const { username, password } = body || {};
    const { username, password } = query;

    if (
      username !== process.env.USERNAME_TEST ||
      password !== process.env.PASSWORD_TEST
    ) {
      addHead(req, res, STATUS_CODE.UNAUTHORIZED);

      return res.end(
        JSON.stringify({
          code: STATUS_CODE.UNAUTHORIZED,
          message: "invalid_grant",
          detailedMessage: "invalid_grant",
        }),
      );
    }

    const token = crypto.randomBytes(48).toString("hex");

    addHead(req, res, STATUS_CODE.SUCCESS);

    return res.end(
      JSON.stringify({
        access_token: token,
        refresh_token: `${token}-${Date.now()}`,
        scope: "default",
        token_type: "Bearer",
        expires_in: 3600,
        status_code: STATUS_CODE.SUCCESS,
        hasMFA: false,
      }),
    );
  });

  /* MOCK: CREATE REGISTER */
  on("POST", "/wsrastreio", async (req, res) => {
    addHead(req, res, STATUS_CODE.CREATE);

    res.end(
      JSON.stringify({
        status: "Created",
        status_code: STATUS_CODE.CREATE,
        message: "Registro importado com sucesso",
      }),
    );
  });

  /* MOCK: FIND REGISTER */
  on("GET", "/wsrastreio/id", async (req, res, { rawQuery }) => {
    const objectResponse = {
      objects: [
        {
          COD: "SP041500345003 ",
          SEQ: "    ",
          DTENTR: "20260416",
          DTINIC: "20260416",
          HRINIC: "16:09",
          DTSAID: "        ",
          HRSAID: "     ",
          USER: "lucas.penha                   ",
          PROCES: "CA",
          STATUS: "EX",
          DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
        },
      ],
    };
    if (
      String(rawQuery).trim() === String(objectResponse.objects[0].COD).trim()
    ) {
      addHead(req, res, STATUS_CODE.SUCCESS);

      res.end(
        JSON.stringify({
          objects: [
            {
              COD: "SP041500345003 ",
              SEQ: "    ",
              DTENTR: "20260416",
              DTINIC: "20260416",
              HRINIC: "16:09",
              DTSAID: "        ",
              HRSAID: "     ",
              USER: "lucas.penha                   ",
              PROCES: "CA",
              STATUS: "EX",
              DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
            },
          ],
        }),
      );
    }
  });

  /* MOCK PROCESS FLOW */
  on("GET", "/wsrastreio/process", async (req, res, { rawQuery }) => {
    const result = {
      CA: {
        data: {
          objects: [
            {
              COD: "SP041400049028 ",
              SEQ: "    ",
              DTENTR: "20260416",
              DTINIC: "20260416",
              HRINIC: "16:09",
              DTSAID: "        ",
              HRSAID: "     ",
              USER: "lucas.penha                   ",
              PROCES: "CA",
              STATUS: "EX",
              DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      RR: {
        data: {
          objects: [
            {
              COD: "SP041400049347 ",
              SEQ: "    ",
              DTENTR: "20260417",
              DTINIC: "20260417",
              HRINIC: "16:09",
              DTSAID: "        ",
              HRSAID: "     ",
              USER: "lucas.penha                   ",
              PROCES: "RR",
              STATUS: "FI",
              DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      PI: {
        data: {
          objects: [
            {
              COD: "SP041400049044 ",
              SEQ: "    ",
              DTENTR: "20260422",
              DTINIC: "20260422",
              HRINIC: "16:09",
              DTSAID: "        ",
              HRSAID: "     ",
              USER: "lucas.penha                   ",
              PROCES: "PI",
              STATUS: "RE",
              DESCRI: "Carretel FS+FF 14pol x 6,35 x 3000mm 150 PSI",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[rawQuery] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  on("POST", "/wsrastreio/new", async (req, res) => {
    const { processo } = req.body;

    const responseCreate = {
      status: "Created",
      status_code: STATUS_CODE.CREATE,
      message: "Registro importado com sucesso",
    };

    const result = {
      CA: { data: responseCreate, status: STATUS_CODE.CREATE },
      RR: { data: responseCreate, status: STATUS_CODE.CREATE },
      PI: { data: responseCreate, status: STATUS_CODE.CREATE },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[processo] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  /* MOCK: SUPPLIER */
  on("GET", "/wsrastreio/list_fornec", async (req, res, { query }) => {
    const { process } = query;

    const result = {
      CA: {
        data: {
          objects: [
            {
              CODIGO: "003385",
              LOJA: "01",
              NOME: "PETROPASY TECNOLOGIA",
              CALDERARIA: "S",
              REVESTIMENTO: "S",
              PINTURA: " ",
            },
            {
              CODIGO: "003671",
              LOJA: "01",
              NOME: "BENAZZI             ",
              CALDERARIA: "S",
              REVESTIMENTO: "N",
              PINTURA: " ",
            },
            {
              CODIGO: "004449",
              LOJA: "01",
              NOME: "CORFAL              ",
              CALDERARIA: "S",
              REVESTIMENTO: "S",
              PINTURA: "S",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      RR: {
        data: {
          objects: [
            {
              CODIGO: "003295",
              LOJA: "01",
              NOME: "SO JATO             ",
              CALDERARIA: "N",
              REVESTIMENTO: "N",
              PINTURA: "S",
            },
            {
              CODIGO: "004449",
              LOJA: "01",
              NOME: "CORFAL              ",
              CALDERARIA: "S",
              REVESTIMENTO: "S",
              PINTURA: "S",
            },
            {
              CODIGO: "005455",
              LOJA: "01",
              NOME: "PROJATO JATEAMENTO E",
              CALDERARIA: "N",
              REVESTIMENTO: "N",
              PINTURA: "S",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      PI: {
        data: {
          objects: [
            {
              CODIGO: "003385",
              LOJA: "01",
              NOME: "PETROPASY TECNOLOGIA",
              CALDERARIA: "S",
              REVESTIMENTO: "S",
              PINTURA: " ",
            },
            {
              CODIGO: "003671",
              LOJA: "01",
              NOME: "BENAZZI             ",
              CALDERARIA: "S",
              REVESTIMENTO: "N",
              PINTURA: " ",
            },
            {
              CODIGO: "004449",
              LOJA: "01",
              NOME: "CORFAL              ",
              CALDERARIA: "S",
              REVESTIMENTO: "S",
              PINTURA: "S",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[process] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  /* MOCK: TRANSFER */
  on("GET", "/wsrastreio/transfer", async (req, res, { query }) => {
    const { process } = query;
    const STATUS_LIST = [
      {
        SIGLA: "SC",
        ORDEM: 1,
        STATUS: "Aguardando SC",
      },
      {
        SIGLA: "PV",
        ORDEM: 2,
        STATUS: "Aguardando PV",
      },
      {
        SIGLA: "RO",
        ORDEM: 3,
        STATUS: "Aguardando ROM",
      },
      {
        SIGLA: "NF",
        ORDEM: 4,
        STATUS: "Aguardando NF",
      },
      {
        SIGLA: "EM",
        ORDEM: 5,
        STATUS: "Nota Emitida",
      },
    ];

    const result = {
      CA: {
        data: {
          STATUS_LIST,
          objects: [
            {
              SIGLA: "NF",
              STATUS: "Aguardando NF",
              DTINI: "2026-08-21",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              ITENS: ["SP041500345003 ", "SP041500345004 "],
              CODIGO: "000001",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "003295",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "SO JATO",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
            {
              SIGLA: "PV",
              STATUS: "Aguardando PV",
              DTINI: "2026-09-01",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              ITENS: ["SP041500302009 ", "SP041500426020 "],
              CODIGO: "000002",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "005436",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "GRUPO – FLANJACO    ",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
            {
              SIGLA: "SC",
              STATUS: "Aguardando SC",
              DTINI: "2026-08-03",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              ITENS: ["SP041500230006 ", "SP041500232006 "],
              CODIGO: "000003",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "005455",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "PROJATO JATEAMENTO E",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      RR: {
        data: {
          STATUS_LIST,
          objects: [],
        },
        status: STATUS_CODE.CREATE,
      },
      PI: {
        data: {
          STATUS_LIST,
          objects: [],
        },
        status: STATUS_CODE.CREATE,
      },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[process] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  on("POST", "/wsrastreio/transfer", async (req, res) => {
    const { processo } = req.body;

    const responseCreate = {
      status: "Created",
      status_code: STATUS_CODE.CREATE,
      message: "Registro importado com sucesso",
    };
    const result = {
      CA: { data: responseCreate, status: STATUS_CODE.CREATE },
      RR: { data: responseCreate, status: STATUS_CODE.CREATE },
      PI: { data: responseCreate, status: STATUS_CODE.CREATE },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[processo] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  /* MOCK PROCESS COMPONENT TRANSFER */
  on("GET", "/wsrastreio/transfer/component", async (req, res, { query }) => {
    const { process } = query;
    const STATUS_LIST = [
      {
        SIGLA: "SC",
        ORDEM: 1,
        STATUS: "Aguardando SC",
      },
      {
        SIGLA: "PV",
        ORDEM: 2,
        STATUS: "Aguardando PV",
      },
      {
        SIGLA: "RO",
        ORDEM: 3,
        STATUS: "Aguardando ROM",
      },
      {
        SIGLA: "NF",
        ORDEM: 4,
        STATUS: "Aguardando NF",
      },
      {
        SIGLA: "EM",
        ORDEM: 5,
        STATUS: "Nota Emitida",
      },
    ];

    const result = {
      CA: {
        data: {
          STATUS_LIST,
          objects: [
            {
              SIGLA: "SC",
              STATUS: "Aguardando SC",
              DTINI: "2026-08-15",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              ITENS: ["TJPLPL50K000311 ", "FLW21224113Z211 "],
              CODIGO: "000001",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "003295",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "SO JATO",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
            {
              SIGLA: "PV",
              STATUS: "Aguardando PV",
              DTINI: "2026-08-21",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              ITENS: ["FLW21224113Z211 ", "TJPLPL50K000311 "],
              CODIGO: "000002",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "005436",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "GRUPO – FLANJACO    ",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
            {
              SIGLA: "NF",
              STATUS: "Aguardando NF",
              ITENS: ["TJPLPL50K000311 ", "FLW21224113Z211 "],
              DTINI: "2026-09-01",
              HRINI: "00:00",
              DTFIM: "",
              HRFIM: "",
              CODIGO: "000003",
              COD_FORNEC1: "005436",
              LOJA_FORNEC1: "01",
              NOME_FORNEC1: "GRUPO – FLANJACO    ",
              COD_FORNEC2: "005455",
              LOJA_FORNEC2: "01",
              NOME_FORNEC2: "PROJATO JATEAMENTO E",
              NUM_SC: "      ",
              PEDIDO: "      ",
              ROMANEIO: "      ",
              REVISAO: "  ",
              AET: "S",
              PROCESSO: "CA",
            },
          ],
        },
        status: STATUS_CODE.CREATE,
      },
      RR: {
        data: {
          STATUS_LIST,
          objects: [],
        },
        status: STATUS_CODE.CREATE,
      },
      PI: {
        data: {
          STATUS_LIST,
          objects: [],
        },
        status: STATUS_CODE.CREATE,
      },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    // const response = result[process] || result["default"];
    const response = result["CA"] || result["default"];
    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  on("POST", "/wsrastreio/transfer/component", async (req, res) => {
    //const { processo } = req.body;
    const processo = "CA";

    const responseCreate = {
      status: "Created",
      status_code: STATUS_CODE.CREATE,
      message: "Registro importado com sucesso",
    };
    const result = {
      CA: { data: responseCreate, status: STATUS_CODE.CREATE },
      RR: { data: responseCreate, status: STATUS_CODE.CREATE },
      PI: { data: responseCreate, status: STATUS_CODE.CREATE },
      default: {
        data: {
          status: "NotFound",
          status_code: STATUS_CODE.NOT_FOUND,
          message: "ERROR ao criar registro",
        },
        status: STATUS_CODE.NOT_FOUND,
      },
    };

    const response = result[processo] || result["default"];

    addHead(req, res, response.status);

    res.end(JSON.stringify(response.data));
  });

  /* MOCK: COMPONENT */
  on("GET", "/wsrastreio/product", async (req, res, { query }) => {
    const { ccodpro } = query;

    const objectResponse = {
      codigo: "FLW21224117Z211",
      descricao:
        "FL 711MM SOLTO PR AWWAC207 CLD DES:AMR-1006916-06-ALV-CP0096-0410-PI-SD-00002",
      message: "Produto cadastrado",
    };

    if (String(ccodpro).trim() === String(objectResponse.codigo).trim()) {
      addHead(req, res, STATUS_CODE.SUCCESS);

      res.end(JSON.stringify(objectResponse));
    }
  });
}

module.exports = { httpSetup };
