import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";
import { ExecutionInformation } from "./ExecutionTracker";

export type ScriptContext = {
  getDriver: <T extends Driver<any, any>>(name: string) => Promise<T>;
  getDriversUsed: () => Array<string>;
  getConfigValue: (key: string) => string;
  cleanupDrivers: (log: Logger) => Promise<Array<string>>;
};

export type MigrationExecutor<T> = (context: ScriptContext, log: Logger) => Promise<T>;

export default interface MigrationScript {
  description?: string;
  up: MigrationExecutor<void>;
  down?: MigrationExecutor<void>;
  hasRun?: MigrationExecutor<boolean>;
}

export interface InitializedMigrationScript {
  name: string;
  description?: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  hasRun: boolean;
  executionInformation?: ExecutionInformation;
}
