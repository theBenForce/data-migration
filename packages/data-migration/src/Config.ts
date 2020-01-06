import { LoadConfigParameters, ProcessorParams } from "../src";

export default interface Configuration {
  defaultStage: string;
  migrationDirectory?: string;
  stages: { [key: string]: LoadConfigParameters<string | ProcessorParams> };
}
