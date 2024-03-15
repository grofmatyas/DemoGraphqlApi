import { ConsoleHandler } from "@debugr/console";
import {
  LogEntry,
  LogLevel,
  ReadonlyRecursive,
  Plugin,
  HandlerPlugin,
} from "@debugr/core";
import { ElasticHandler } from "@debugr/elastic";
import dayjs from "dayjs";
import * as util from "util";

import { ApiConfig } from "../config/config";
import { ApiService } from "../container/decorators";
import { ErrorHandler } from "../errors/errorHandler";

declare module "@debugr/core" {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  export const enum LogLevel {
    SYSTEM = 59,
  }
}

export type ITaskContext = {
  userIp: string;
  workerId: number;
  queryOrMutationName: string;
  apiRequestOrigin: string;
  restRoute: string;
  restMethod: string;
  serverId: number;
  origin: string;
  tokenPart: string;

  taskStack: string[];
};

export type IGlobalContext = {
  workerId?: number;
};

@ApiService()
// @ts-expect-error Bug in Debugr with new typescript version, In progress
export class ApiLogger extends ErrorHandler<ITaskContext, IGlobalContext> {
  public constructor(config: ApiConfig, isMock: boolean = false) {
    super(config, {
      globalContext: {
        workerId: Number.parseInt(config.system.worker || "0", 10),
      },
      plugins: ([] as Plugin[]).concat(
        isMock
          ? []
          : config.system.environment === "DEVELOP"
            ? [new ConsoleHandler({ threshold: LogLevel.INFO })]
            : (
                [
                  new ConsoleHandler({ threshold: LogLevel.SYSTEM }),
                ] as HandlerPlugin[]
              ).concat(
                config.application.elastic.host
                  ? [
                      new ElasticHandler({
                        node: config.application.elastic.host,
                        auth:
                          config.application.elastic.auth.username &&
                          config.application.elastic.auth.password
                            ? {
                                username:
                                  config.application.elastic.auth.username,
                                password:
                                  config.application.elastic.auth.password,
                              }
                            : undefined,
                        threshold: LogLevel.ALL,
                        transformer: (
                          entry: ReadonlyRecursive<
                            // @ts-expect-error Bug in Debugr with new typescript version, In progress
                            LogEntry<ITaskContext, IGlobalContext>
                          >,
                          taskStack?: string[] | undefined,
                        ): Record<string, any> | undefined => {
                          if (entry.error && (entry.error as any).parameters) {
                            (entry.error as any).parameters = JSON.stringify(
                              (entry.error as any).parameters,
                            );
                          }

                          return {
                            ...entry,
                            time: entry.ts,
                            globalContext: entry.globalContext,
                            taskContext: {
                              ...(entry.taskContext || {}),
                              taskStack,
                            },
                            data: entry.data
                              ? JSON.stringify(this.sanitizeData(entry.data))
                              : undefined,
                            errorMessage: entry.error?.message,
                            errorSerialized: entry.error
                              ? util.inspect(entry.error)
                              : undefined,
                            error: undefined,
                          };
                        },
                        index: (
                          _entry: ReadonlyRecursive<
                            // @ts-expect-error Bug in Debugr with new typescript version, In progress
                            LogEntry<ITaskContext, IGlobalContext>
                          >,
                        ): string => {
                          return `${
                            config.system.environment === "STAGE"
                              ? "staging-api"
                              : "production-api"
                          }-log-${dayjs().year()}`;
                        },
                      }),
                    ]
                  : [],
              ),
      ),
    });
  }

  private sanitizeData<T extends Record<string, any>>(args: T): T {
    const modifiedArgs = JSON.parse(JSON.stringify(args));

    const argsKeys = Object.keys(args);

    for (const argsKey of argsKeys) {
      if (
        modifiedArgs[argsKey] &&
        typeof modifiedArgs[argsKey] === "object" &&
        !Array.isArray(modifiedArgs[argsKey])
      ) {
        modifiedArgs[argsKey] = this.sanitizeData(modifiedArgs[argsKey]);
      }

      if (typeof modifiedArgs[argsKey] === "string") {
        if (argsKey.match(/password/gi)) {
          modifiedArgs[argsKey] = "<hidden>";
        }

        /**
         * Cut token in half and replace the second half with '...'
         *
         * confidential-token-123 => confidentia...
         */
        if (argsKey.match(/token/gi) && modifiedArgs[argsKey].length >= 2) {
          modifiedArgs[argsKey] = `${modifiedArgs[argsKey].slice(
            0,
            modifiedArgs[argsKey].length / 2,
          )}...`;
        }
      }
    }

    return modifiedArgs;
  }

  public child(context: Record<string, any>, _options?: any): ApiLogger {
    Object.keys(context).forEach((key) =>
      this.setContextProperty(key as keyof ITaskContext, context[key]),
    );
    return this;
  }

  public warn(data: Record<string, any> | Error): this;
  public warn(
    message: string | [string, ...any],
    data?: Record<string, any>,
  ): this;
  public warn(
    message: string | [string, ...any],
    error: Error,
    data?: Record<string, any>,
  ): this;
  public warn(message: any, dataOrError?: any, maybeData?: any): this {
    return this.warning(message, dataOrError, maybeData);
  }

  public get level() {
    return "";
  }
}
