import DriverBuilder from "./DriverBuilder";

import { ProcessorParams } from "./Processor";

export { default as Processor } from "./Processor";
export { ProcessorParams } from "./Processor";
export {
  default as MigrationScript,
  MigrationDrivers
} from "./MigrationScript";
export { default as DriverBuilder } from "./DriverBuilder";

import * as _ from "lodash";
import { createLogger } from "./Utils";
import MigrationScript from "./MigrationScript";

export interface LoadConfigParameters<T> {
  [key: string]: {
    driver: DriverBuilder;
    params: {
      [key: string]: T;
    };
  };
}

export default {
  up(migrationScript: MigrationScript) {},

  /**
   * Runs all processors on the given parameters
   * @param params The parameter object
   * @param observer
   */
  async loadConfig(
    drivers: LoadConfigParameters<string | ProcessorParams>,
    observer?: ZenObservable.Observer<any>
  ): Promise<LoadConfigParameters<string>> {
    const result = _.cloneDeep(drivers);
    const log = createLogger(observer);
    const error = createLogger(observer);

    for (const driverName of Object.keys(result)) {
      const params = result[driverName].params;
      log(`Processing ${driverName} parameters`);

      for (const key of Object.keys(params)) {
        try {
          const value = params[key];

          if (!value || typeof value === "string") {
            continue;
          }

          log(`Processing ${driverName} parameter ${key}`);
          if (!value.processor) {
            throw new Error(`No processor provided for ${key}`);
          }

          const processorResult = await value.processor(value.params, observer);
          params[key] = processorResult;
        } catch (ex) {
          error(ex.message);
          throw ex;
        }
      }
    }

    return result as LoadConfigParameters<string>;
  }
};
