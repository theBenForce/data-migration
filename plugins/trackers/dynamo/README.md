# Welcome to dm-tracker-dynamodb 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-tracker-dynamodb)](https://www.npmjs.com/package/dm-tracker-dynamodb)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-tracker-dynamodb.svg)](https://npmjs.org/package/dm-tracker-dynamodb)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) tracker to keep track of which migration scripts have been executed.

# Configuration

## Parameters

The DynamoDB driver accepts the following parameters as part of its configuration:

| Name             | Type   | Required | Description                                                                            |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| region           | string | Yes      | The AWS Region where this table exists                                                 |
| TableName        | string | Yes      | The name of the DynamoDB table to connect to                                           |
| partitionKeyName | string | Yes      | Name of the partition key in the dynamo table                                          |
| sortKeyName      | string | Yes      | Name of the sort key in the dynamo table                                               |
| profile          | string | No       | Name of the AWS profile to use                                                         |
| accessKeyId      | string | No       | AWS Credentials, if not provided data-migration will use the default AWS configuration |
| secretAccessKey  | string | No       |                                                                                        |
| prefix           | string | No       | Value to use for the partition key for migration records                               |
