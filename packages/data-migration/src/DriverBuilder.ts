import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";

type DriverBuilder<T, D extends Driver<any, any>> = (params: T, logger: Logger) => D;

export default DriverBuilder;
