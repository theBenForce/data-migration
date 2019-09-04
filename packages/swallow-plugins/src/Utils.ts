import { MissingParameters } from "./Errors";

export function checkParameters(
  label: string,
  requiredParams: Array<string>,
  params: Map<string, string>
) {
  const missingParams = requiredParams.filter(key => !params.has(key));
  if (missingParams.length > 0) {
    throw new MissingParameters(label, missingParams);
  }
}
