const PROCESS_STATUS = {
  acronym: {
    reservado: "RE",
    executando: "EX",
    pausado: "PU",
    continua: "CO",
    finalizado: "FI",
    reverte: "RV",
    sucata: "SU",
    romaneio: "RO",
  },
  acronym_next: {
    RE: ["EX"],
    PU: ["CO"],
    EX: ["PU", "FI"],
    FI: ["RO", "RV", "SU"],
  },
  acronym_next_card: {
    RE: ["EX", "FI", "RO"],
    PU: ["CO", "FI", "RO"],
    EX: ["PU", "FI", "RO"],
    FI: ["EX", "FI", "RO"],
    RO: ["EX", "FI", "RO"],
  },
  name: {
    RE: "reservado",
    EX: "execução",
    PU: "pausado",
    CO: "continua",
    FI: "finalizado",
    RV: "reversível",
    SU: "sucata",
    RO: "romaneio",
  },
  description: {
    reservado: "(aguardando início)",
    executando: "(em processo produção)",
    pausado: "(aguardando para continuar)",
    continua: "(retornar para execução)",
    finalizado: `(aguardando "Aprova CQ")`,
    sucata: "(descarte do produto)",
    reverte: "(retorna início processo.)",
    romaneio: "(aguardando próxima etapa)",
  },
};

exports.PROCESS_STATUS = PROCESS_STATUS;
