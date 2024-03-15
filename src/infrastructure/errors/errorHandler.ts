import {
  Logger,
  LoggerOptions,
  TContextBase,
  TContextShape,
} from "@debugr/core";
import { ExecutionResult, GraphQLError } from "graphql";
import { MercuriusContext } from "mercurius";

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

  public graphqlErrorFormatter = <
    TContext extends MercuriusContext = MercuriusContext,
  >(
    execution: ExecutionResult,
    _context: TContext,
  ): {
    statusCode: number;
    response: ExecutionResult;
  } => {
    const processId = this.getProcessId();

    const errors = execution.errors?.map((error) => {
      this.error("response error", error);
      const message: string = "Unknown Error";
      const code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;

      if (error?.extensions?.isApiError) {
        return new GraphQLError(error.message, {
          extensions: {
            processId,
            code: error?.extensions?.code,
          },
        });
      }

      // space for more error parsing

      // Graphql ValidationError parsing

      return new GraphQLError(message, {
        extensions: {
          processId,
          code,
        },
      });
    });

    return {
      statusCode: 500,
      response: {
        errors,
      },
    };
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
