import * as AWS from "aws-sdk";
import { ColumnMetadata, ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { DriverBuilder, Logger, RdsDriver } from "data-migration";
import { QueryOptions } from "data-migration/lib/DriverTypes/RDS";
import { Observable } from "rxjs";
import { AuroraParameters } from "aws-sdk/clients/quicksight";

function convertResultsToObject<T>(
  metadata?: AWS.RDSDataService.ColumnMetadata[]
): (record: AWS.RDSDataService.Field[]) => T {
  if (!metadata) {
    throw new Error(`No metadata defined!`);
  }

  return (record: AWS.RDSDataService.Field[]) => {
    const result: { [key: string]: any } = {};

    metadata.forEach((value: ColumnMetadata, idx: number) => {
      result[value.name || ""] =
        record[idx].stringValue ||
        record[idx].longValue ||
        record[idx].doubleValue ||
        record[idx].booleanValue ||
        record[idx].blobValue;
    });

    return result as T;
  };
}

interface AuroraRdsParameters {
  region: string;
  profile?: string;
  resourceArn: string;
  secretArn: string;
  databaseSchema: string | undefined;
}

export type AuroraRdsDriver = RdsDriver<AuroraRdsParameters, AWS.RDSDataService>;

const rdsDriver: DriverBuilder<AuroraRdsParameters, AWS.RDSDataService> = (
  params: AuroraRdsDriver,
  logger: Logger
): AuroraRdsDriver => {
  let dataService = new AWS.RDSDataService({
    apiVersion: "2018-08-01",
    region: params.region,
    credentials: params.profile
      ? new AWS.SharedIniFileCredentials({ profile: params.profile })
      : undefined,
  });
  let transactionId: string | undefined;
  let paramsBase = {
    resourceArn: params.resourceArn,
    secretArn: params.secretArn,
  };

  return {
    parameters: params,
    resource: dataService,
    query<T>(
      query: string,
      parameters?: Array<AWS.RDSDataService.SqlParameter>,
      options?: QueryOptions
    ): Observable<T> {
      // @ts-ignore
      return new Observable<T>(async (subscriber) => {
        try {
          const queryParameters: ExecuteStatementRequest = {
            ...paramsBase,
            sql: query,
            database: params.databaseSchema,
            schema: params.databaseSchema,
            includeResultMetadata: true,
            parameters,
          };

          if (!options?.excludeFromTransaction) {
            queryParameters.transactionId = transactionId;
          }

          const result = await dataService.executeStatement(queryParameters).promise();

          if (result.records !== undefined) {
            result.records
              .map(convertResultsToObject<T>(result.columnMetadata))
              .forEach((record) => subscriber.next(record));
          }

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

      const result = await dataService.executeStatement(queryParameters).promise();

      if (result?.records?.length) {
        return convertResultsToObject<T>(result.columnMetadata)(result.records?.[0]);
      }
    },

    async init() {
      const transactionParams = {
        ...paramsBase,
        database: params.databaseSchema,
        schema: params.databaseSchema,
      };

      logger(`Creating transaction`);
      const result = await dataService.beginTransaction(transactionParams).promise();
      transactionId = result.transactionId;
    },

    async cleanup() {
      if (transactionId !== undefined) {
        const transactionParams = {
          ...paramsBase,
          transactionId,
        };

        logger(`Committing transaction`);
        await dataService.commitTransaction(transactionParams).promise();
      }
    },
  } as AuroraRdsDriver;
};

export default rdsDriver;
