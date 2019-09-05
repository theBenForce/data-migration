import Driver from "./DriverTypes";

type DriverBuilder = (params: { [key: string]: string }) => Driver;

export default DriverBuilder;
