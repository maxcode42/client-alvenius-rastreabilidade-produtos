const PROCESS_FLOW = {
  route: {
    register: {
      name: "register",
      acronym: "",
    },
    boilermaking: {
      name: "boilermaking",
      acronym: "CA",
    },

    coating: {
      name: "coating",
      acronym: "RR",
    },
    painting: {
      name: "painting",
      acronym: "PI",
    },
    supplier: {
      name: "supplier",
      acronym: "FO",
    },
    transfer: {
      name: "transfer",
      acronym: "TR",
    },
  },
  acronym: {
    caldeiraria: "CA",
    revestimento: "RR",
    pintura: "PI",
    supplier: "FO",
    transfer: "TR",
  },
  name: {
    CA: "caldeiraria",
    RR: "revestimento",
    PI: "pintura",
    FO: "fornecedor",
    TR: "transfere",
  },
  text_next_allowed: {
    RE: "Iniciar",
    EX: "Pausar ou Finalizar",
    PU: "Continuar",
    FI: "Qualificar",
    RV: "Reservar",
    SU: "Descartar",
    RO: "Romaneio",
    default: "para seguir",
  },
};

exports.PROCESS_FLOW = PROCESS_FLOW;
