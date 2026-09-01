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
        hidden: false,
      },
      {
        type: "link",
        name: "Componente",
        href: "/transfer/component",
        target: "",
        key: "component",
        text: "Transferência componente / próximas etapas processo",
        icon: "ComponentIcon", //"BlocksIcon", //
        hidden: true,
      },
      {
        type: "button",
        name: "Spool",
        href: "",
        target: "",
        key: "spool",
        text: "Transferência spool / próximas etapas processo",
        icon: "PackageOpenIcon", //"BoxesIcon", //
        hidden: true,
      },
      {
        type: "link",
        name: "Caldeiraria",
        href: "/boilermaking",
        target: "",
        key: "boilermaking",
        text: "Ler QRCode Spool caldeiraria / próximas etapas processo",
        icon: "PaintBucketIcon",
        hidden: false,
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
        hidden: false,
      },
      {
        type: "link",
        name: "Pintura",
        href: "/painting",
        target: "",
        key: "painting",
        text: "Ler QRCode Spool pintura / próximas etapas processo",
        icon: "PaintRollerIcon",
        hidden: false,
      },
    ],
  },
  {
    classCss: "justify-center",
    item: [
      {
        type: "link",
        name: "Validar QRCode",
        href: "/validates-qrcode",
        target: "",
        key: "valid",
        text: "Ler QRCode e validar / campos spool e componentes",
        icon: "QrCodeIcon",
        hidden: false,
      },
      {
        type: "button",
        name: "Transferência",
        href: "/transfer",
        target: "",
        key: "transfer",
        text: "Ler QRCode e criar transferência / próximas etapas processo",
        icon: "TruckIcon",
        hidden: false,
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
        hidden: false,
      },
    ],
  },
];

exports.ITENS_MENU = ITENS_MENU;
