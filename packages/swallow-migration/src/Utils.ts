import { MissingParameters } from "./Errors";
import * as babel from "@babel/core";

export function checkParameters(
  label: string,
  requiredParams: Array<string>,
  params: { [key: string]: any }
) {
  const missingParams = requiredParams.filter(key => !params[key]);
  if (missingParams.length > 0) {
    throw new MissingParameters(label, missingParams);
  }
}

export function createLogger(observer?: ZenObservable.Observer<any>) {
  return function log(message: string) {
    if (observer && observer.next) {
      observer.next(message);
    } else {
      console.log(message);
    }
  };
}

export function createErrorLogger(observer?: ZenObservable.Observer<any>) {
  return function log(message: string) {
    if (observer && observer.error) {
      observer.error(message);
    } else {
      console.error(message);
    }
  };
}

export async function loadScript<T>(filename: string): Promise<T> {
  const transformResult = await babel.transformFileAsync(filename, {
    presets: [
      "@babel/preset-typescript",
      ["@babel/preset-env", { targets: { node: true } }]
    ],
    cwd: process.cwd()
  });

  let script: T;
  if (transformResult && transformResult.code) {
    script = eval(transformResult.code);
  }

  // @ts-ignore
  return script;
}
