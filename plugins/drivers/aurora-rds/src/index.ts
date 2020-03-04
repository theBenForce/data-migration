import * as AWS from "aws-sdk";
import { ColumnMetadata, ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { DriverBuilder } from "data-migration";
import RDSDriver, { QueryOptions } from "data-migration/lib/DriverTypes/RDS";
import { Observable } from "rxjs";

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
  resourceArn: string;
  secretArn: string;
  databaseSchema: string | undefined;
}

const rdsDriver: DriverBuilder<AuroraRdsParameters> = (
  params,
  logger: (message: string) => void
): RDSDriver => {
  let dataService: AWS.RDSDataService;
  let transactionId: string | undefined;
  let paramsBase = {
    resourceArn: params.resourceArn,
    secretArn: params.secretArn,
  };

  return {
    query<T>(
      query: string,
      parameters: Array<AWS.RDSDataService.SqlParameter>,
      options?: QueryOptions
    ): Observable<T> {
      // @ts-ignore
      return new Observable<T>(async (subscriber) => {
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

        if (result.records === undefined) {
          return [];
        }

        result.records
          .map(convertResultsToObject<T>(result.columnMetadata))
          .forEach((record) => subscriber.next(record));

        subscriber.complete();
      });
    },

    async init() {
      dataService = new AWS.RDSDataService({
        apiVersion: "2018-08-01",
        region: params.region,
      });

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
  };
};

export = rdsDriver;
