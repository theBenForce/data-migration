import { DriverBuilder, Logger, RdsDriver } from "data-migration";
import { QueryOptions } from "data-migration/lib/DriverTypes/RDS";
import { Observable } from "rxjs";

import pgp, { IDatabase } from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

import * as AWS from "aws-sdk";

type PostgresDriverParameters = pg.IConnectionParameters;

export type PostgresDriver = RdsDriver<PostgresDriverParameters, IDatabase<any>>;

const rdsDriver: DriverBuilder<PostgresDriverParameters, IDatabase<any>> = (
  params,
  logger: Logger
): PostgresDriver => {
  let db: IDatabase<any>;
  let transactionId: string | undefined;
  let parameters = params;

  return {
    get parameters() {
      return parameters;
    },
    get resource(): IDatabase<any> {
      return db;
    },

    async init(params: PostgresDriverParameters) {
      logger(`Initializing with parameters: ${JSON.stringify(params)}`);
      parameters = params;

      db = pgp()(parameters);

      logger(`Creating transaction`);
      await db.any("START TRANSACTION");
    },

    query<T>(
      query: string,
      parameters?: Array<AWS.RDSDataService.SqlParameter>,
      options?: QueryOptions
    ): Observable<T> {
      // @ts-ignore
      return new Observable<T>(async (subscriber) => {
        try {
          if (!options?.excludeFromTransaction) {
            logger(`Exclude from transaction is not supported in this driver.`);
          }

          const result = await db.any(
            query,
            parameters?.reduce((params, next) => {
              if (next.name) params[next.name] = next.value;
              return params;
            }, {} as Record<string, any>)
          );

          result.forEach((record) => subscriber.next(record));

          subscriber.complete();
        } catch (x) {
          subscriber.error(x);
        }
      });
    },

    async insert<T>(
      query: string,
      parameters?: Array<AWS.RDSDataService.SqlParameter>
    ): Promise<T | undefined> {
      const queryParameters: ExecuteStatementRequest = {
        ...paramsBase,
        sql: query,
        database: params.databaseSchema,
        schema: params.databaseSchema,
        includeResultMetadata: true,
        parameters,
        transactionId,
      };

      const result = await db.any<T>(query);

      if (result?.records?.length) {
        return convertResultsToObject<T>(result.columnMetadata)(result.records?.[0]);
      }
    },

    async cleanup() {
      logger(`Committing transaction`);
      await db.none("COMMIT TRANSACTION");
    },
  } as AuroraRdsDriver;
};

export default rdsDriver;
