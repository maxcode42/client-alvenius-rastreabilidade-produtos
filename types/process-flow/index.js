const PROCESS_FLOW = {
  route: {
    register: {
      name: "register",
      acronym: "",
      acronym_next: "",
    },
    boilermaking: {
      name: "boilermaking",
      acronym: "CA",
      acronym_next: "RR",
    },
    coating: {
      name: "coating",
      acronym: "RR",
      acronym_next: "PI",
    },
    painting: {
      name: "painting",
      acronym: "PI",
      acronym_next: "",
    },
    supplier: {
      name: "supplier",
      acronym: "FO",
      acronym_next: "",
    },
    transfer: {
      name: "transfer",
      acronym: "TR",
      acronym_next: "",
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
