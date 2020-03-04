import { LoadConfigParameters, ProcessorParams } from "../src";

export default interface Configuration {
  defaultStage: string;
  migrationDirectory?: string;
  stages: Record<string, LoadConfigParameters<string | ProcessorParams>>;
}
