import Driver from "./Driver";

export interface User {
  Username?: string;
  Attributes: { [key: string]: string };
  Created?: Date;
  Modified?: Date;
  Enabled?: boolean;
  Status?: string;
}

export default interface UserPoolDriver extends Driver {
  addUser: (
    username: string,
    password: string,
    attributes?: any
  ) => Promise<User>;

  deleteUser: (username: string) => Promise<void>;

  getUser: (username: string) => Promise<User | undefined>;
}
