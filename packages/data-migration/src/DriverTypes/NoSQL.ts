import Driver from "./Driver";
import { Observable } from "rxjs";

export default interface NoSqlDriver extends Driver {
  getAllRecords: <T>() => Observable<T>;
  putRecord: <T>(record: T) => Promise<T>;
  putRecordsBulk: <T>(records: Array<T>) => Promise<T>;
}
