import { Logger, ScriptContext } from "../";
import { Driver } from "../DriverTypes";
import ProcessParams from "./ProcessParams";

export default function createScriptContext(
  drivers: Map<string, Driver<any, any>>,
  config: { [key: string]: string },
  log: Logger,
): ScriptContext {
  let driversUsed: Array<string> = [];
  return {
    async getDriver<T extends Driver<any, any>>(driverName: string): Promise<T> {
      if (!drivers.has(driverName)) {
        const availableDrivers: Array<string> = [];

        for (const driverName of drivers.keys()) {
          availableDrivers.push(driverName);
        }

        throw new Error(
          `No driver named ${driverName} found! Available drivers are ${availableDrivers.join(
            ", "
          )}`
        );
      }

      let result = drivers.get(driverName) as T;

      if (driversUsed.indexOf(driverName) === -1) {
        log(`Processing ${driverName} parameters`);
        result.parameters = await ProcessParams(result.parameters, log);
        
        driversUsed.push(driverName);
        if (result.init) await result.init();
      }

      return result;
    },

    getConfigValue: (key: string) => config[key],

    getDriversUsed: () => driversUsed,

    async cleanupDrivers(log): Promise<Array<string>> {
      const drivers = [...driversUsed];

      for (const driverName of drivers) {
        const driver = await this.getDriver(driverName);
        if (!driver.cleanup) continue;

        await driver.cleanup();
      }

      driversUsed = [];

      return drivers;
    },
  };
}
