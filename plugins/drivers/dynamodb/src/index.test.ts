import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import NoSqlDriver from "data-migration/lib/DriverTypes/NoSQL";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

type AWSCallback<T> = (err?: AWS.AWSError, data?: T) => void;

describe("dynamodb driver tests", () => {
  test("should download until LastEvaluatedKey is undefined", async () => {
    AWSMock.setSDKInstance(AWS);
    let remaining = 1;
    const mockScan = jest.fn(
      (
        params: AWS.DynamoDB.DocumentClient.ScanInput,
        callback: AWSCallback<DocumentClient.ScanOutput>
      ) => {
        const result = {
          Count: 1,
          Items: [{ value: `Dummy Data ${remaining}` }],
        } as AWS.DynamoDB.DocumentClient.ScanOutput;

        if (remaining-- > 0) {
          result.LastEvaluatedKey = {
            partitionKey: `PARTITION_KEY_${remaining}`,
          };
        }

        callback(undefined, result);
      }
    );

    AWSMock.mock("DynamoDB.DocumentClient", "scan", mockScan);

    const driverInstance: NoSqlDriver = require("./index")(
      {
        region: "us-east-1",
        TableName: "TEST_TABLE",
      },
      () => {}
    );
    driverInstance
      .getAllRecords<Record<string, string>>()
      .pipe(catchError((error) => of(`Promise Error: ${error}`)))
      .subscribe(
        (record) => {},
        (error) => console.error(error),
        () => {
          expect(mockScan).toHaveBeenCalledTimes(2);
        }
      );
  });
});
