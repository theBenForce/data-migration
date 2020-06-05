# Welcome to dm-driver-lambda 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-driver-lambda)](https://www.npmjs.com/package/dm-driver-lambda)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-driver-lambda.svg)](https://npmjs.org/package/dm-driver-lambda)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to update lambda properties like environment variables.

# Configuration

## Parameters

The Lambda driver accepts the following parameters as part of its configuration:

| Name            | Type   | Required | Description                                                                            |
| --------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| region          | string | Yes      | The AWS Region where this table exists                                                 |
| FunctionName    | string | Yes      | The name (or ARN) of the function to modify                                            |
| accessKeyId     | string | No       | AWS Credentials, if not provided data-migration will use the default AWS configuration |
| secretAccessKey | string | No       |
| endpoint        | string | No       | The http endpoint to connect to, useful when using something like localstack           |

## Sample Configuration

```typescript
export default {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      users: {
        driver: require("dm-driver-lambda"),
        params: {
          region: "us-east-1",
          FunctionName: {
            // Use this processor to get values from CloudFormation
            processor: require("dm-processor-cf"),
            params: {
              stack: "some-stack-name",
              output: "SomeOutputName",
              region: "us-east-1",
            },
          },
        },
      },
    },
  },
} as Configuration;
```
