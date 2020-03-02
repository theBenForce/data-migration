import Driver from "./Driver";

export default interface NoSQL extends Driver {
  getAllRecords: <T>() => Promise<Array<T>>;
  putRecord: <T>(record: T) => Promise<T>;
}
