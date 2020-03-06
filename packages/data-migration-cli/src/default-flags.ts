import { flags } from "@oclif/command";

export interface DefaultFlagParameters {
  config: string;
  stage?: string;
}

export const DefaultFlags = {
  config: flags.string({
    default: "./.dm.config.ts",
    description: "Path to the configuration file to use",
  }),
  stage: flags.string({
    description: "Stage that will be used when loading config values",
  }),
};
