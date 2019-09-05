import { DriverBuilder } from "swallow-migration/lib";
import UserPool from "swallow-migration/lib/DriverTypes/UserPool";

const cognitoDriver: DriverBuilder = (params: { [key: string]: string }) => {
  return {
    async addUser(username: string, password: string) {
      console.info("Adding username...");
    }
  } as UserPool;
};
