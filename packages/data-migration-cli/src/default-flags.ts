import { flags } from "@oclif/command";

export interface DefaultFlagParameters {
  config: string;
  stage?: string;
}

export const DefaultFlags = {
  config: flags.string({
    default: "./.dm.config.ts",
    description: "Path to the configuration file",
  }),
  stage: flags.string({
    description: "Stage name to use",
  }),
};
