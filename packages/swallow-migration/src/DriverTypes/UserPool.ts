export default interface UserPoolDriver {
  addUser: (username: string, password: string) => Promise<void>;
}
