import Driver from "./Driver";
import { Observable } from "rxjs";

export default interface RDS extends Driver {
  query<T>(query: string, params: Array<any>): Observable<T>;
}
