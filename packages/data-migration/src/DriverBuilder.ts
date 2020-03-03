import { Driver } from "./DriverTypes";

type DriverBuilder<T> = (params: T, logger: (message: string) => void) => Driver;

export default DriverBuilder;
