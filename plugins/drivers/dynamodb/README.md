# Welcome to dm-driver-dynamodb 👋

[![Build Status](https://travis-ci.org/theBenForce/data-migration.svg?branch=master)](https://travis-ci.org/theBenForce/data-migration)
[![NPM Package](https://img.shields.io/npm/v/dm-driver-dynamodb)](https://www.npmjs.com/package/dm-driver-dynamodb)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://thebenforce.github.io/data-migration/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-driver-dynamodb.svg)](https://npmjs.org/package/dm-driver-dynamodb)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to load/create DynamoDB entries.

# Configuration

## Parameters

The DynamoDB driver accepts the following parameters as part of its configuration:

| Name            | Type   | Required | Description                                                                            |
| --------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| region          | string | Yes      | The AWS Region where this table exists                                                 |
| TableName       | string | Yes      | The name of the DynamoDB table to connect to                                           |
| accessKeyId     | string | No       | AWS Credentials, if not provided data-migration will use the default AWS configuration |
| secretAccessKey | string | No       |

## Sample Configuration

```javascript
module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      users: {
        driver: require("dm-driver-dynamodb"),
        params: {
          region: "us-east-1",
          TableName: {
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
};
```
