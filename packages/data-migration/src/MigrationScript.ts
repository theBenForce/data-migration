import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";
import { ExecutionInformation } from "./ExecutionTracker";

export type ScriptContext = {
  getDriver: <T extends Driver>(name: string) => Promise<T>;
  getDriversUsed: () => Array<string>;
  getConfigValue: (key: string) => string;
};

export type MigrationExecutor<T> = (context: ScriptContext, log: Logger) => Promise<T>;

export default interface MigrationScript {
  up: MigrationExecutor<void>;
  down?: MigrationExecutor<void>;
  hasRun?: MigrationExecutor<boolean>;
}

export interface InitializedMigrationScript {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  hasRun: boolean;
  executionInformation?: ExecutionInformation;
}
