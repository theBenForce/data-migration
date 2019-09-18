import { ProcessorParams, LoadConfigParameters } from "..";

import { Driver } from "../DriverTypes";

import { createLogger, createErrorLogger } from "../Utils";
import * as _ from "lodash";

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
  const newParams: { [key: string]: string } = {};

  for (const driverName of Object.keys(sourceDrivers)) {
    const params = sourceDrivers[driverName].params;
    log(`Processing ${driverName} parameters`);

    for (const key of Object.keys(params)) {
      try {
        const value = params[key];

        if (!value || typeof value === "string") {
          newParams[key] = value;
          continue;
        }

        log(`Processing ${driverName} parameter ${key}`);
        if (!value.processor) {
          throw new Error(`No processor provided for ${key}`);
        }

        const processorResult = await value.processor(value.params, log);
        newParams[key] = processorResult;
      } catch (ex) {
        log(ex.message);
        throw ex;
      }
    }

    resultDrivers.set(
      driverName,
      sourceDrivers[driverName].driver(newParams, createLogger(driverName))
    );
  }

  return resultDrivers;
}
