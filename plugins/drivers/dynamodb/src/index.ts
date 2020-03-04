import * as AWS from "aws-sdk";
import { DriverBuilder } from "data-migration";
import NoSqlDriver from "data-migration/lib/DriverTypes/NoSQL";
import { Observable } from "rxjs";

interface DynamoDbParameters {
  region: string;
  TableName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

const dynamoDbDriver: DriverBuilder<DynamoDbParameters> = (
  params,
  logger: (message: string) => void
): NoSqlDriver => {
  const { TableName } = params;
  const DocumentDb = new AWS.DynamoDB.DocumentClient({
    region: params.region,
    apiVersion: "2012-08-10",
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
    endpoint: params.endpoint,
  });

  return {
    getAllRecords<T>(): Observable<T> {
      // @ts-ignore
      return new Observable<T>(async (subscriber) => {
        const params = {
          TableName,
        } as AWS.DynamoDB.DocumentClient.ScanInput;

        let resultsRaw: AWS.DynamoDB.DocumentClient.ScanOutput;

        do {
          resultsRaw = await DocumentDb.scan(params).promise();
          logger(`Downloaded ${resultsRaw.Count} records from ${TableName}`);
          params.ExclusiveStartKey = resultsRaw.LastEvaluatedKey;

          if (resultsRaw.Items) {
            for (const item of resultsRaw.Items) {
              subscriber.next(item as T);
            }
          }
        } while (resultsRaw?.LastEvaluatedKey);

        subscriber.complete();
      });
    },
    async putRecord<T>(record: T): Promise<T> {
      logger(`Writing ${JSON.stringify(record)} to ${TableName}`);
      const result = await DocumentDb.put({
        ReturnConsumedCapacity: "INDEXES",
        TableName,
        Item: record,
      }).promise();

      logger(`Used ${result.ConsumedCapacity?.WriteCapacityUnits} Write capacity units`);

      return result.Attributes as T;
    },
    async putRecordsBulk<T>(records: Array<T>): Promise<Array<T>> {
      logger(`Writing ${records.length} entries to ${TableName}`);

      const params = {
        ReturnConsumedCapacity: "INDEXES",
        RequestItems: {},
      } as AWS.DynamoDB.DocumentClient.BatchWriteItemInput;

      params.RequestItems[TableName] = records.map(
        (record) =>
          ({
            PutRequest: {
              Item: record,
            },
          } as AWS.DynamoDB.DocumentClient.WriteRequest)
      );

      const result = await DocumentDb.batchWrite(params).promise();

      logger(
        `Used ${result.ConsumedCapacity?.reduce(
          (total, next) => total + (next.WriteCapacityUnits || 0),
          0
        )}`
      );

      if (result.UnprocessedItems?.[TableName]?.length) {
        logger(
          `Error writing items to ${TableName}: ${JSON.stringify(
            result.UnprocessedItems[TableName]
          )}`
        );
      }

      return records;
    },
  } as NoSqlDriver;
};

export = dynamoDbDriver;
