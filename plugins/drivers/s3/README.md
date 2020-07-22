# Welcome to dm-driver-s3 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-driver-s3)](https://www.npmjs.com/package/dm-driver-s3)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-driver-s3.svg)](https://npmjs.org/package/dm-driver-s3)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to query/modify a cognito user pool.

## Configuration

### Parameters

The S3 driver accepts the following parameters as part of its configuration:

| Name       | Type   | Required | Description                             |
| ---------- | ------ | -------- | --------------------------------------- |
| region     | string | Yes      | The AWS Region where this bucket exists |
| bucketName | string | Yes      | Name of the bucket to interact with     |
| profile    | string | No       | Name of the AWS profile to use          |

### Example

The following configuration creates a S3 driver that connects to a bucket in the `us-east-1` stack `some-stack-name`.

```javascript
module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      defaultParams: {
        region: "us-east-1",
      },
      drivers: {
        users: {
          driver: require("dm-driver-s3"),
          params: {
            bucketName: {
              // Use this processor to get values from CloudFormation
              processor: require("dm-processor-cf"),
              params: {
                stack: "some-stack-name",
                output: "SomeOutputName",
              },
            },
          },
        },
      },
    },
  },
};
```
