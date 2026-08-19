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
  collectCoverage: false,
  coverageDirectory: "coverage",

  coverageReporters: [
    "text", // terminal
    "lcov", // integração CI (Codecov, Sonar, etc)
    "html", // relatório visual
    "json-summary",
  ],

  // O que será coberto
  collectCoverageFrom: [
    "<rootDir>/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
  ],

  // Ignorar arquivos específicos
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
    "/public/",
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
});

module.exports = jestConfig;
