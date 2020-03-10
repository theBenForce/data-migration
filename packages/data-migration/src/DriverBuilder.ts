import { Driver } from "./DriverTypes";
import { Logger } from "./Logger";

type DriverBuilder<P, R> = (params: P, logger: Logger) => Driver<P, R>;

export default DriverBuilder;
