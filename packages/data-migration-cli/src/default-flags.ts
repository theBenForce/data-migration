import { flags } from "@oclif/command";

export interface DefaultFlagParameters {
  config: string;
  stage?: string;
  scope?: string;
}

export const DefaultFlags = {
  config: flags.string({
    default: "./.dm.config.ts",
    description: "Path to the configuration file",
  }),
  stage: flags.string({
    description: "Stage name to use",
  }),
  scope: flags.string({
    description: "Script scope to use",
  }),
  awsProfile: flags.string({
    description: "AWS Profile to use",
    default: process.env.AWS_PROFILE,
  }),
};
