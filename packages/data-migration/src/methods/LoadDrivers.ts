import * as _ from "lodash";

import { LoadConfigParameters, ProcessorParams } from "../../src";
import { Driver } from "../DriverTypes";

import ProcessParams from "./ProcessParams";

/**
 * Runs all processors on the given parameters
 * @param params The parameter object
 */
export default async function loadDrivers(
  stageConfig: LoadConfigParameters<string | ProcessorParams>,
  log: (message: string) => void,
  createLogger: (driverName: string) => (message: string) => void
): Promise<Map<string, Driver>> {
  const sourceDrivers = _.cloneDeep(stageConfig);
  const resultDrivers = new Map<string, Driver>();

  for (const driverName of Object.keys(sourceDrivers)) {
    if (driverName === "defaultParams" || driverName === "params") {
      continue;
    }
    const params = {
      ...sourceDrivers.defaultParams,
      ...sourceDrivers[driverName].params,
    };

    log(`Processing ${driverName} parameters`);

    const processedParams = await ProcessParams(params, log, sourceDrivers.defaultParams);

    resultDrivers.set(
      driverName,
      sourceDrivers[driverName].driver(processedParams, createLogger(driverName))
    );
  }

  return resultDrivers;
}
