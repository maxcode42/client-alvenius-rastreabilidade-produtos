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

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = async () => {
  const baseConfig = await createJestConfig({
    moduleDirectories: ["node_modules", "<rootDir>"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    // collectCoverageFrom: [
    //   "<rootDir>/**/*.{js,jsx,ts,tsx}",
    //   "!**/*.d.ts",
    //   "!**/node_modules/**",
    //   "!**/.next/**",
    //   "!**/coverage/**",
    // ],

    // coveragePathIgnorePatterns: [
    //   "/node_modules/",
    //   "/.next/",
    //   "/coverage/",
    //   "/public/",
    // ],
  })();

  return {
    testTimeout: 60000,

    collectCoverage: false,
    coverageDirectory: "coverage",

    coverageReporters: ["text", "lcov", "html", "json-summary"],

    projects: [
      {
        ...baseConfig,
        // displayName: "api",
        testEnvironment: "node",
        testMatch: [
          "<rootDir>/tests/**/api/**/*.test.js",
          "<rootDir>/tests/**/api/**/*.test.ts",
        ],
      },
      {
        ...baseConfig,
        // displayName: "web",
        testEnvironment: "jsdom",
        testMatch: [
          "<rootDir>/tests/**/web/**/*.test.js",
          "<rootDir>/tests/**/web/**/*.test.ts",
        ],
      },
    ],
  };
};
