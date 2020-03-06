import DriverBuilder from "./DriverBuilder";

export { default as Processor } from "./Processor";
export { ProcessorParams } from "./Processor";
export { default as MigrationScript, ScriptContext, MigrationExecutor } from "./MigrationScript";
export { default as DriverBuilder } from "./DriverBuilder";
export { default as Configuration } from "./Config";
export { Logger } from "./Logger";
export * from "./DriverTypes";
import * as UtilsImport from "./Utils";
export const Utils = UtilsImport;

import * as _ from "lodash";

import * as methods from "./methods";
import { ProcessorParams } from "./Processor";
import { ExecutionTrackerParams } from "./ExecutionTracker";
import Configuration from "./Config";

export interface ConfigDriverEntry<T> {
  driver: DriverBuilder<any, any>;
  params: Record<string, T>;
}

export type LoadConfigParameters<T> = {
  defaultParams?: Record<string, string>;
  contextParams?: Record<string, string | ProcessorParams>;
  tracker?: ExecutionTrackerParams;
  drivers?: Record<string, ConfigDriverEntry<T>>;
};

export const loadConfiguration = (configFile: string): Promise<Configuration> =>
  UtilsImport.loadScript<Configuration>(configFile);

export default methods;
