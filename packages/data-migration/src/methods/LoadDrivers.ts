import * as _ from "lodash";

import { LoadConfigParameters, ProcessorParams } from "../../src";
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

  for (const driverName of Object.keys(sourceDrivers.drivers)) {
    const params = {
      ...sourceDrivers.defaultParams,
      ...sourceDrivers.drivers[driverName].params,
    };

    log(`Processing ${driverName} parameters`);

    const processedParams = await ProcessParams(params, log, sourceDrivers.defaultParams);

    resultDrivers.set(
      driverName,
      sourceDrivers.drivers[driverName].driver(processedParams, createLogger(driverName))
    );
  }

  return resultDrivers;
}
