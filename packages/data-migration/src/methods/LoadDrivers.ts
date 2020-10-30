import * as _ from "lodash";

import { LoadConfigParameters, ProcessorParams } from "../index";
import { Driver } from "../DriverTypes";

import ProcessParams from "./ProcessParams";
import { Logger } from "../Logger";

/**
 * Runs all processors on the given parameters
 * @param params The parameter object
 */
export default async function loadDrivers(
  stageConfig: LoadConfigParameters<string | ProcessorParams>,
  log: Logger,
  createLogger: (driverName: string) => Logger
): Promise<Map<string, Driver<any, any>>> {
  const sourceDrivers = _.cloneDeep(stageConfig);
  const resultDrivers = new Map<string, Driver<any, any>>();

  if (sourceDrivers.drivers) {
    for (const driverName of Object.keys(sourceDrivers.drivers)) {
      const params = {
        ...sourceDrivers.defaultParams,
        ...sourceDrivers.drivers[driverName].params,
      };

      resultDrivers.set(
        driverName,
        sourceDrivers.drivers[driverName].driver(params, createLogger(driverName))
      );
    }
  }

  return resultDrivers;
}
