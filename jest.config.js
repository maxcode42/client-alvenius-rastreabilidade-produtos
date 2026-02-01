const path = require("path");
const dotenv = require("dotenv");
const nextJest = require("next/jest");
const dotenvExpand = require("dotenv-expand");

const envPath = path.resolve(process.cwd(), ".env.development");

dotenv.config({
  path: envPath,
});

dotenvExpand.expand({
  ...dotenv,
  parsed: {
    ...dotenv.parsed,
    ...process.env,
  },
});

const jestConfigCreate = nextJest({
  dir: ".",
});
const jestConfig = jestConfigCreate({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testEnvironment: "node",
  testTimeout: 60_000,
});

module.exports = jestConfig;
