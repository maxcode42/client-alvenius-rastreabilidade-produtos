const createProtheusMockServer = require("./fetch-mock-protheus.js");

const mock = createProtheusMockServer({ port: 4001 });

mock.setupDefaults();

mock.start();

console.log("Mock rodando...");
