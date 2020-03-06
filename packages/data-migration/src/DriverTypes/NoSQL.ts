import Driver from "./Driver";
import { Observable } from "rxjs";

export default interface NoSqlDriver<P, R> extends Driver<P, R> {
  getAllRecords<T>(): Observable<T>;
  putRecord<T>(record: T): Promise<T>;
  deleteRecord<T>(key: T): Promise<any>;
  putRecordsBulk<T>(records: Array<T>): Promise<T>;
  deleteRecordsBulk<T>(keys: Array<T>): Promise<any>;
}
