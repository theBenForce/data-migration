import { LoadConfigParameters, ProcessorParams } from ".";

export default interface Configuration {
  defaultStage: string;
  migrationDirectory?: string;
  stages: { [key: string]: LoadConfigParameters<string | ProcessorParams> };
}
