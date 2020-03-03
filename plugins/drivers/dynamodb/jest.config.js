const {
  pathsToModuleNameMapper
} = require("../../../node_modules/ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

// compilerOptions.rootDir = compilerOptions.baseUrl = "./";
compilerOptions.module = "CommonJS";
compilerOptions.target = "ES6";

module.exports = {
  // ts-jest Configurations: https://kulshekhar.github.io/ts-jest/user/config/
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsConfig: compilerOptions
    }
  },
  automock: false,

  clearMocks: true,

  // collect coverage messes up unit test debugging
  collectCoverage: true,

  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],

  coverageDirectory: "coverage",

  restoreMocks: false,

  roots: ["src"],

  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "((\\.|/)(test\\.|spec\\.))(js|ts)$",
  moduleFileExtensions: ["ts", "js", "json"],
  testPathIgnorePatterns: ["/node_modules"]

  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: "<rootDir>/src/"
  // })
};
