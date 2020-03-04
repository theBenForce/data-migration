import Driver from "./Driver";
import { Observable } from "rxjs";

export interface QueryOptions {
  excludeFromTransaction?: boolean;
}

export default interface RDS extends Driver {
  query<T>(query: string, params: Array<any>, options?: QueryOptions): Observable<T>;
}
