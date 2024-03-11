import {
  Logger,
  LoggerOptions,
  TContextBase,
  TContextShape,
} from "@debugr/core";
import { GraphQLError } from "graphql";

import { ApiError } from "./apiError";
import { ErrorCode } from "./errorMessages";
import { ApiConfig } from "../config/config";

export abstract class ErrorHandler<
  TTaskContext extends TContextBase = TContextBase,
  TGlobalContext extends TContextShape = TContextShape,
> extends Logger<TTaskContext, TGlobalContext> {
  public constructor(
    protected readonly config: ApiConfig,
    loggerOptions: LoggerOptions<TTaskContext, TGlobalContext>,
  ) {
    super(loggerOptions);
  }

  public apolloErrorHandler = (error: GraphQLError): GraphQLError => {
    this.error("response error", error);
    const processId = this.getProcessId();
    const message: string = "Unknown Error";
    const code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;

    if ((error?.extensions?.exception as ApiError)?.isApiError) {
      return new GraphQLError(error.message, {
        extensions: {
          processId,
          code: error?.extensions?.exception?.code,
        },
      });
    }

    // space for more error parsing

    return new GraphQLError(message, {
      extensions: {
        processId,
        code,
      },
    });
  };

  private getProcessId = (): string | string[] | undefined => {
    try {
      // @ts-expect-error accessing private property
      return this.taskContextStorage.getStore().taskStack;
    } catch (e) {
      this.fatal("Could not find process id or elastic handler");
      return undefined;
    }
  };
}
