import * as AWS from "aws-sdk";
// tslint:disable-next-line: no-duplicate-imports
import { RDSDataService } from "aws-sdk";
import {
  ColumnMetadata,
  ExecuteStatementRequest
} from "aws-sdk/clients/rdsdataservice";
import { DriverBuilder } from "data-migration/lib";
import RDSDriver from "data-migration/lib/DriverTypes/RDS";

function convertResultsToObject<T>(
  metadata?: AWS.RDSDataService.ColumnMetadata[]
): (record: RDSDataService.Field[]) => T {
  if (!metadata) {
    throw new Error(`No metadata defined!`);
  }
  return (record: RDSDataService.Field[]) => {
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

const rdsDriver: DriverBuilder = (
  params: { [key: string]: string },
  logger: (message: string) => void
): RDSDriver => {
  let dataService: RDSDataService;
  let transactionId: string;
  let paramsBase = {
    resourceArn: params.resourceArn,
    secretArn: params.secretArn
  };

  return {
    async query<T>(
      query: string,
      parameters: Array<RDSDataService.SqlParameter>
    ): Promise<Array<T>> {
      const queryParameters: ExecuteStatementRequest = {
        ...paramsBase,
        sql: query,
        database: params.database,
        schema: params.schema,
        includeResultMetadata: true,
        transactionId,
        parameters
      };

      const result = await dataService
        .executeStatement(queryParameters)
        .promise();

      if (result.records === undefined) {
        return [];
      }

      return result.records.map(
        convertResultsToObject<T>(result.columnMetadata)
      );
    },

    async init() {
      dataService = new AWS.RDSDataService({
        apiVersion: "2018-08-01",
        region: params.region
      });

      const transactionParams = {
        ...paramsBase,
        database: params.database,
        schema: params.schema
      };

      logger(`Creating transaction`);
      let { transactionId } = await dataService
        .beginTransaction(transactionParams)
        .promise();
    },

    async cleanup() {
      const transactionParams = {
        ...paramsBase,
        transactionId
      };

      logger(`Committing transaction`);
      await dataService.commitTransaction(transactionParams).promise();
    }
  };
};
