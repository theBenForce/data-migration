import * as AWS from "aws-sdk";
import { AdminCreateUserRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";
import CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
import { DriverBuilder, Logger, Driver } from "data-migration";
import UserPoolDriver, { User } from "data-migration/lib/DriverTypes/UserPool";

function convertToStandardUser(input: CognitoIdentityServiceProvider.UserType): User {
  const Attributes: { [key: string]: string } = {};

  if (input.Attributes) {
    input.Attributes.forEach(
      // @ts-ignore
      (attr) => (Attributes[attr.Name] = attr.Value)
    );
  }
  return {
    Username: input.Username,
    Attributes,
    Created: input.UserCreateDate,
    Modified: input.UserLastModifiedDate,
    Enabled: input.Enabled,
    Status: input.UserStatus,
  };
}

interface CognitoDriverParams {
  userPool: string;
  region: string;
}

export type CognitoDriver = UserPoolDriver<CognitoDriverParams, AWS.CognitoIdentityServiceProvider>;

const cognitoDriver: DriverBuilder<CognitoDriverParams, AWS.CognitoIdentityServiceProvider> = (
  params,
  logger: Logger
): CognitoDriver => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    region: params.region,
  });
  let userPool: { UserPoolId: string };

  return {
    async addUser(username: string, password: string, attributes?: any): Promise<User> {
      logger(`Adding ${username}...`);

      const addUserParams: AdminCreateUserRequest = {
        ...userPool,
        Username: username,
        TemporaryPassword: password,
        MessageAction: "SUPPRESS",
        ...attributes,
      };

      const result = await cognitoidentityserviceprovider.adminCreateUser(addUserParams).promise();

      if (!result.User) {
        throw new Error(`User ${username} not created`);
      }

      logger(`User ${result.User.Username} created with status ${result.User.UserStatus}`);
      return convertToStandardUser(result.User);
    },
    async getUser(username: string): Promise<User | undefined> {
      const getUser: CognitoIdentityServiceProvider.AdminGetUserRequest = {
        ...userPool,
        Username: username,
      };

      let result;

      try {
        const response = await cognitoidentityserviceprovider.adminGetUser(getUser).promise();
        result = convertToStandardUser(response);
      } catch (ex) {
        logger(`User ${username} not found in ${userPool.UserPoolId}`);
      }

      return result;
    },
    async deleteUser(username: string) {
      const deleteUser: CognitoIdentityServiceProvider.AdminDeleteUserRequest = {
        ...userPool,
        Username: username,
      };

      await cognitoidentityserviceprovider.adminDeleteUser(deleteUser).promise();
    },
    async init() {
      logger("Initializing cognito");

      userPool = { UserPoolId: params.userPool };
    },
    async cleanup() {
      logger("Cleaning up cognito driver");
    },
  } as CognitoDriver;
};

export default cognitoDriver;
