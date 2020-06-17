import Driver from "./Driver";
import { Observable } from "rxjs";

export interface QueryOptions {
  excludeFromTransaction?: boolean;
}

export default interface RdsDriver<P, D> extends Driver<P, D> {
  query<T>(query: string, params?: Array<any>, options?: QueryOptions): Observable<T>;
  insert<T>(query: string, params?: Array<any>): Promise<T | undefined>;
}
