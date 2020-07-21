import * as AWS from "aws-sdk";
import { DriverBuilder, Logger, Driver } from "data-migration";
import { Observable } from "rxjs";
import * as fs from "fs";

interface S3DriverParameters {
  bucketName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
  profile?: string;
}

export interface S3Driver extends Driver<S3DriverParameters, AWS.S3> {
  /** Uploads a local file to the bucket. The observable gives progress updates. */
  uploadFile(key: string, filename: string, encoding: BufferEncoding): Observable<number>;

  /** Lists all objects in the bucket, optionally filtered. */
  listObjects(prefix?: string): Observable<AWS.S3.Object>;

  /** Deletes the given key, returns `true` on success. */
  deleteObject(key: string): Promise<boolean>;
}

const s3DriverBuilder: DriverBuilder<S3DriverParameters, AWS.S3> = (
  parameters,
  logger: Logger
): S3Driver => {
  const { bucketName } = parameters;

  const resource = new AWS.S3({
    apiVersion: "2006-03-01",
    region: parameters.region,
    accessKeyId: parameters.accessKeyId,
    secretAccessKey: parameters.secretAccessKey,
    credentials: parameters.profile
      ? new AWS.SharedIniFileCredentials({ profile: parameters.profile })
      : undefined,
  });

  return {
    resource,
    parameters,
    uploadFile(key: string, filename: string, encoding: BufferEncoding): Observable<number> {
      return new Observable<number>((subscriber) => {
        const managedUpload = new AWS.S3.ManagedUpload({
          service: resource,
          params: {
            Bucket: bucketName,
            Key: key,
            Body: fs.createReadStream(filename, encoding),
          },
        });

        managedUpload.on(`httpUploadProgress`, (progress) => {
          logger(`Uploaded ${progress.loaded} / ${progress.total} to ${bucketName}/${key}`);
          if (progress.total == undefined) return;
          subscriber.next(Math.round((progress.loaded / progress.total) * 100));
        });

        managedUpload.send((err, data) => {
          if (err) {
            logger(`Error uploading ${filename} to ${bucketName}/${key}: ${JSON.stringify(err)}`);
            subscriber.error(err.message);
            return;
          }

          subscriber.complete();
        });
      });
    },
    listObjects(prefix?: string): Observable<AWS.S3.Object> {
      // @ts-ignore
      return new Observable<AWS.S3.Object>(async (subsriber) => {
        let ContinuationToken: string | undefined;

        do {
          const results = await resource
            .listObjectsV2({
              Bucket: bucketName,
              Prefix: prefix,
              ContinuationToken,
            })
            .promise();

          results.Contents?.forEach((obj) => subsriber.next(obj));
          ContinuationToken = results.ContinuationToken;
        } while (ContinuationToken != undefined);

        subsriber.complete();
      });
    },
    async deleteObject(key: string): Promise<boolean> {
      try {
        const result = await resource
          .deleteObject({
            Bucket: bucketName,
            Key: key,
          })
          .promise();

        logger(JSON.stringify(result));
        return true;
      } catch (ex) {
        logger(ex);
      }

      return false;
    },
  };
};

export default s3DriverBuilder;
