import { ScriptContext } from "../";
import { Driver } from "../DriverTypes";

export default function createScriptContext(
  drivers: Map<string, Driver<any, any>>,
  config: { [key: string]: string }
): ScriptContext {
  const driversUsed: Array<string> = [];
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
        driversUsed.push(driverName);
        if (result.init) await result.init();
      }

      return result;
    },

    getConfigValue: (key: string) => config[key],

    getDriversUsed: () => driversUsed,
  };
}
