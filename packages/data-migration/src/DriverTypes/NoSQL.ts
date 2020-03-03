import Driver from "./Driver";
import { Observable } from "rxjs";

export default interface NoSQL extends Driver {
  getAllRecords: <T>() => Observable<T>;
  putRecord: <T>(record: T) => Promise<T>;
}
