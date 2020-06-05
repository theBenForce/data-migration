# Welcome to dm-processor-cf 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-processor-cf)](https://www.npmjs.com/package/dm-processor-cf)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-processor-cf.svg)](https://npmjs.org/package/dm-processor-cf)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) processor to load values from CloudFormation stack outputs.

# Configuration

## Parameters

The CloudFormation processor accepts the following parameters as part of its configuration:

| Name      | Type   | Required | Description                                                                                                            |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| region    | string | Yes      | The AWS Region where this table exists                                                                                 |
| stack     | string | Yes      | The name of the stack to get values from                                                                               |
| output    | string | Maybe    | Name of the output that should be loaded. Required if `logicalId` is not provided                                      |
| logicalId | string | Maybe    | Logical ID of a resource in the stack. The processor will return the Physical ID. Required if `output` is not provided |
| profile   | string | No       | Name of the AWS profile to use                                                                                         |

## Sample Configuration

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
          driver: require("dm-driver-dynamodb"),
          params: {
            TableName: {
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
