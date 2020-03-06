import { LoadConfigParameters, ProcessorParams } from "./";

export default interface Configuration {
  defaultStage?: string;
  migrationDirectory?: string;
  stages: Record<string, LoadConfigParameters<string | ProcessorParams>>;
}
