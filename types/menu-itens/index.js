const ITENS_MENU = [
  {
    classCss: "",
    item: [
      {
        type: "link",
        name: "Cadastro",
        href: "/register",
        target: "",
        key: "register",
        text: "Cadastro Spool e componentes",
        icon: "PackagePlusIcon",
      },
      {
        type: "link",
        name: "Caldeiraria",
        href: "/boilermaking",
        target: "",
        key: "boilermaking",
        text: "Ler QRCode Spool caldeiraria / próximas etapas processo",
        icon: "PaintBucketIcon",
      },
    ],
  },
  {
    classCss: "",
    item: [
      {
        type: "link",
        name: "Revestimento",
        href: "/coating",
        target: "",
        key: "coating",
        text: "Ler QRCode Spool revestimento / próximas etapas processo",

        icon: "SprayCanIcon",
      },
      {
        type: "link",
        name: "Pintura",
        href: "/painting",
        target: "",
        key: "painting",
        text: "Ler QRCode Spool pintura / próximas etapas processo",
        icon: "PaintRollerIcon",
      },
    ],
  },
  {
    classCss: "justify-center",
    item: [
      {
        type: "button",
        name: "Romaneio",
        href: "/transfer",
        target: "",
        key: "supllier",
        text: "Ler QRCode Spool criar romaneio / próximas etapas processo",
        icon: "BoxesIcon",
        // icon: "TruckIcon",
      },
    ],
  },
  {
    classCss: "justify-center",
    item: [
      {
        type: "link",
        name: "IR PARA SITE ALVENIUS",
        key: "site-alvenius",
        target: "_blank",
        href: "https://alvenius.ind.br/",
        text: "Empresa, Produtos, Orçamento, Catálogos, Contato, etc.",
        icon: "GlobeIcon",
      },
    ],
  },
];

exports.ITENS_MENU = ITENS_MENU;
