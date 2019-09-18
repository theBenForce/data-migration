import { Driver } from "../DriverTypes";

import { ScriptContext } from "..";

export default function createScriptContext(
  drivers: Map<string, Driver>
): ScriptContext {
  const driversUsed: Array<string> = [];
  return {
    async getDriver<T extends Driver>(driverName: string): Promise<T> {
      if (!drivers.has(driverName)) {
        throw new Error(`No driver named ${driverName} found!`);
      }

      let result = drivers.get(driverName) as T;

      if (driversUsed.indexOf(driverName) === -1) {
        driversUsed.push(driverName);
        await result.init();
      }

      return result;
    },

    getDriversUsed: () => driversUsed
  };
}
