import Driver from "./Driver";

export default interface RDS extends Driver {
  query: <T>(query: string, params: Array<any>) => Promise<Array<T>>;
}
