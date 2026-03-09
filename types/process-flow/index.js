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
  },
  acronym: {
    caldeiraria: "CA",
    revestimento: "RR",
    pintura: "PI",
  },
  name: {
    CA: "caldeiraria",
    RR: "revestimento",
    PI: "pintura",
  },
};

exports.PROCESS_FLOW = PROCESS_FLOW;
