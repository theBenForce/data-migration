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

export interface ConfigDriverEntry<T> {
  driver: DriverBuilder<any>;
  params: Record<string, T>;
}

export type LoadConfigParameters<T> = {
  defaultParams?: Record<string, string>;
  contextParams?: Record<string, string | ProcessorParams>;
  drivers: Record<string, ConfigDriverEntry<T>>;
};

import * as methods from "./methods";
import { ProcessorParams } from "./Processor";

export default methods;
