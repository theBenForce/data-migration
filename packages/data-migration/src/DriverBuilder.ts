import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";

type DriverBuilder<T> = (params: T, logger: Logger) => Driver;

export default DriverBuilder;
