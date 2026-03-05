const PROCESS_FLOW = {
  route: {
    register: {
      name: "register",
      sigle: "",
    },
    boilermaking: {
      name: "boilermaking",
      sigle: "CA",
    },

    coating: {
      name: "coating",
      sigle: "RR",
    },
    painting: {
      name: "painting",
      sigle: "PI",
    },
  },
  sigle: {
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
