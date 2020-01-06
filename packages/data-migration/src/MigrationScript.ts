import { Driver } from "./DriverTypes";

export type ScriptContext = {
  getDriver: <T extends Driver>(name: string) => Promise<T>;
  getDriversUsed: () => Array<string>;
  getConfigValue: (key: string) => string;
};

export type MigrationExecutor<T> = (
  context: ScriptContext,
  log: (message: string) => void
) => Promise<T>;

export default interface MigrationScript {
  up: MigrationExecutor<void>;
  down?: MigrationExecutor<void>;
  hasRun?: MigrationExecutor<boolean>;
}
