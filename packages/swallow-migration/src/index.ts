import DriverBuilder from "./DriverBuilder";

export { default as Processor } from "./Processor";
export { ProcessorParams } from "./Processor";
export { default as MigrationScript, ScriptContext } from "./MigrationScript";
export { default as DriverBuilder } from "./DriverBuilder";

import * as _ from "lodash";

export interface LoadConfigParameters<T> {
  [key: string]: {
    driver: DriverBuilder;
    params: {
      [key: string]: T;
    };
  };
}

import * as methods from "./methods";

export default methods;
