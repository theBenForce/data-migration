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
  uploadFile(
    key: string,
    filename: string,
    onProgress?: (progress: number) => void
  ): Promise<AWS.S3.ManagedUpload.SendData>;

  /** Lists all objects in the bucket, optionally filtered. */
  listObjects(prefix?: string): Observable<AWS.S3.Object>;

  /** Deletes the given key, returns `true` on success. */
  deleteObject(key: string): Promise<boolean>;
}

const s3DriverBuilder: DriverBuilder<S3DriverParameters, AWS.S3> = (
  params,
  logger: Logger
): S3Driver => {
  let bucketName: string;
  let parameters = params;
  let resource: AWS.S3;

  return {
    get resource() {
      return resource;
    },
    get parameters() {
      return parameters;
    },
    async init(params) {
      logger(`Initializing with parameters: ${JSON.stringify(params)}`);
      parameters = params;

      resource = new AWS.S3({
        apiVersion: "2006-03-01",
        region: params.region,
        accessKeyId: params.accessKeyId,
        secretAccessKey: params.secretAccessKey,
        credentials: params.profile
          ? new AWS.SharedIniFileCredentials({ profile: params.profile })
          : undefined,
      });

    },
    uploadFile(
      key: string,
      filename: string,
      onProgress?: (progress: number) => void
    ): Promise<AWS.S3.ManagedUpload.SendData> {
      return new Promise((resolve, reject) => {
        const managedUpload = new AWS.S3.ManagedUpload({
          service: resource,
          params: {
            Bucket: bucketName,
            Key: key,
            Body: fs.readFileSync(filename),
          },
        });

        if (onProgress) {
          managedUpload.on(`httpUploadProgress`, (progress) => {
            logger(`Uploaded ${progress.loaded} / ${progress.total} to ${bucketName}/${key}`);
            if (progress.total == undefined) return;
            onProgress(Math.round((progress.loaded / progress.total) * 100));
          });
        }

        managedUpload.send((err, data) => {
          if (err) {
            logger(`Error uploading ${filename} to ${bucketName}/${key}: ${JSON.stringify(err)}`);
            reject(err.message);
            return;
          }

          resolve(data);
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
