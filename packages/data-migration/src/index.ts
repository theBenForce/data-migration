import DriverBuilder from "./DriverBuilder";

export { default as Processor } from "./Processor";
export { ProcessorParams } from "./Processor";
export { default as MigrationScript, ScriptContext, MigrationExecutor } from "./MigrationScript";
export { default as DriverBuilder } from "./DriverBuilder";
export { default as Configuration } from "./Config";
export { Driver } from "./DriverTypes";

import * as _ from "lodash";

export interface ConfigDriverEntry<T> {
  driver: DriverBuilder<any>;
  params: Record<string, T>;
}

export type LoadConfigParameters<T> = {
  defaultParams?: Record<string, string>;
} & Record<string, ConfigDriverEntry<T>>;

import * as methods from "./methods";

export default methods;
