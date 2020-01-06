export class MissingParameters extends Error {
  constructor(label: string, params: Array<string>) {
    super(`${label} is missing the following parameters: ${params.join(", ")}`);
  }
}
