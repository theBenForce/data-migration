import { ProcessorParams, LoadConfigParameters } from "..";

import { Driver } from "../DriverTypes";

import { createLogger, createErrorLogger } from "../Utils";
import * as _ from "lodash";
import ProcessParams from "./ProcessParams";

/**
 * Runs all processors on the given parameters
 * @param params The parameter object
 * @param observer
 */
export default async function loadDrivers(
  drivers: LoadConfigParameters<string | ProcessorParams>,
  log: (message: string) => void,
  createLogger: (driverName: string) => (message: string) => void
): Promise<Map<string, Driver>> {
  const sourceDrivers = _.cloneDeep(drivers);
  const resultDrivers = new Map<string, Driver>();

  for (const driverName of Object.keys(sourceDrivers)) {
    const params = sourceDrivers[driverName].params;
    log(`Processing ${driverName} parameters`);

    const processedParams = await ProcessParams(params, log);

    resultDrivers.set(
      driverName,
      sourceDrivers[driverName].driver(
        processedParams,
        createLogger(driverName)
      )
    );
  }

  return resultDrivers;
}
