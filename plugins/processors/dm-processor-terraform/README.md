# Welcome to dm-processor-terraform 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-processor-cf)](https://www.npmjs.com/package/dm-processor-cf)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-processor-terraform.svg)](https://npmjs.org/package/dm-processor-terraform)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) processor to load values from Terraform outputs.

# Configuration

## Parameters

The Terraform processor accepts the following parameters as part of its configuration:

| Name      | Type   | Required | Description                                                                                                            |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| filename    | string | Yes      | Path to a terraform output file                                                                               |
| output     | string | Yes      | The name of the terraform output to return                                                                              |

## Sample Configuration

```typescript
import DynamoDbDriver from "dm-driver-dynamodb";
import TerraformProcessor from "dm-processor-terraform";

export default {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      defaultParams: {
        region: "us-east-1",
      },
      drivers: {
        users: {
          driver: DynamoDbDriver,
          params: {
            TableName: {
              // Use this processor to get values from CloudFormation
              processor: TerraformProcessor,
              params: {
                filename: "some_output_file.terraform.json",
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
