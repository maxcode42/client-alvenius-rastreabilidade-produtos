const ITENS_MENU_SUB = [
  {
    classCss: "",
    item: [
      {
        name: "Cadastro",
        href: "/register",
        target: "",
        key: "register",
        text: "Cadastro Spool e componentes",
        icon: "PackagePlusIcon",
        submenu: null,
      },
      {
        name: "Caldeiraria",
        href: "/boilermaking",
        target: "",
        key: "boilermaking",
        text: "Ler QRCode Spool caldeiraria / próximas etapas processo",
        icon: "PaintBucketIcon",
        submenu: [
          {
            name: "Fabrica",
            href: "/boilermaking",
            target: "",
            key: "boilermaking-factory",
            text: "Ler QRCode",
            icon: "FactoryIcon",
          },
          {
            name: "Romaneio",
            href: "/transfer",
            target: "",
            key: "boilermaking-romaneio-create",
            text: "Criar romaneio",
            icon: "BoxesIcon", //"PlusCircleIcon", "BoxesIcon",
          },
          {
            name: "Lista-RO",
            href: "/transfer",
            target: "",
            key: "boilermaking-romaneio-list",
            text: "Lista romaneio",
            icon: "ListCheckIcon",
          },
        ],
      },
    ],
  },
  {
    classCss: "",
    item: [
      {
        name: "Revestimento",
        href: "/coating",
        target: "",
        key: "coating",
        text: "Ler QRCode Spool revestimento / próximas etapas processo",
        icon: "SprayCanIcon",
        submenu: [
          {
            name: "Fabrica",
            href: "/coating",
            target: "",
            key: "coating-factory",
            text: "Ler QRCode",
            icon: "FactoryIcon",
          },
          {
            name: "Romaneio",
            href: "/transfer",
            target: "",
            key: "coating-romaneio-create",
            text: "Criar romaneio",
            icon: "BoxesIcon", //"PlusCircleIcon", "BoxesIcon",
          },
          {
            name: "Lista-RO",
            href: "/transfer",
            target: "",
            key: "coating-romaneio-list",
            text: "Lista romaneio",
            icon: "ListCheckIcon",
          },
        ],
      },
      {
        name: "Pintura",
        href: "/painting",
        target: "",
        key: "painting",
        text: "Ler QRCode Spool pintura / próximas etapas processo",
        icon: "PaintRollerIcon",
        submenu: [
          {
            name: "Fabrica",
            href: "/painting",
            target: "",
            key: "painting-factory",
            text: "Ler QRCode",
            icon: "FactoryIcon",
          },
          {
            name: "Romaneio",
            href: "/transfer",
            target: "",
            key: "painting-romaneio-create",
            text: "Criar romaneio",
            icon: "BoxesIcon", //"PlusCircleIcon", "BoxesIcon",
          },
          {
            name: "Lista-RO",
            href: "/transfer",
            target: "",
            key: "painting-romaneio-list",
            text: "Lista romaneio",
            icon: "ListCheckIcon",
          },
        ],
      },
    ],
  },
  {
    classCss: "justify-center",
    item: [
      {
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

exports.ITENS_MENU = ITENS_MENU_SUB;
