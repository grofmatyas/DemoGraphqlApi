import { BaseResolver } from "./base";
import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ErrorCode } from "../../../infrastructure/errors/errorMessages";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import { GraphqlQuery, GraphqlResolver } from "../decorators";

// This resolver is necessary for existence of Errors enum in graphql schema

@GraphqlResolver()
@ApiService()
export class ErrorResolver extends BaseResolver {
  public constructor(
    databaseDataProvider: DatabaseDataProvider,
    logger: ApiLogger,
  ) {
    super(databaseDataProvider, logger);
  }

  @GraphqlQuery(() => ErrorCode)
  public async error(): Promise<ErrorCode> {
    return ErrorCode.BAD_REQUEST;
  }
}
