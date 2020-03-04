import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";

export type ScriptContext = {
  getDriver: <T extends Driver>(name: string) => Promise<T>;
  getDriversUsed: () => Array<string>;
  getConfigValue: (key: string) => string;
};

export type MigrationExecutor<T> = (context: ScriptContext, log: Logger) => Promise<T>;

export default interface MigrationScript {
  name: string;
  up: MigrationExecutor<void>;
  down?: MigrationExecutor<void>;
  hasRun?: MigrationExecutor<boolean>;
}
