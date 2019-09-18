import { Driver } from "./DriverTypes";

type DriverBuilder = (
  params: { [key: string]: string },
  logger: (message: string) => void
) => Driver;

export default DriverBuilder;
