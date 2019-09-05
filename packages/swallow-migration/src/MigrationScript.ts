import Driver from "./DriverTypes";

export type MigrationDrivers = {
  getDriver: <T>(name: string) => T;
};

export type MigrationExecutor<T> = (
  drivers: MigrationDrivers,
  log: (message: string) => void
) => Promise<T>;

export default interface MigrationScript {
  up: MigrationExecutor<void>;
  down?: MigrationExecutor<void>;
  hasRun?: MigrationExecutor<boolean>;
}
