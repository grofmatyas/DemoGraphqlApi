import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { PaginatedInputClassAbstract } from "../../../entity/graphql/paginated/input/factory";
import { PaginatedResponseClassAbstract } from "../../../entity/graphql/paginated/response/factory";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiError } from "../../../infrastructure/errors/apiError";
import { ErrorCode } from "../../../infrastructure/errors/errorMessages";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import { GraphqlResolver } from "../decorators";

@GraphqlResolver()
@ApiService()
export class BaseResolver {
  public constructor(
    protected readonly databaseDataProvider: DatabaseDataProvider,
    protected readonly logger: ApiLogger,
  ) {}

  public get em() {
    return this.databaseDataProvider.getEntityManager();
  }

  protected sanitizeInput(input: unknown): void | never {
    if (input === null) {
      return;
    }
    if (typeof input === "object") {
      // @ts-expect-error TODO: this
      Object.keys(input).map((key) => this.sanitizeInput(input[key]));
    }
    if (Array.isArray(input)) {
      for (const item of input) {
        this.sanitizeInput(item);
      }
    }
    if (typeof input === "string" && input === "") {
      throw new ApiError(
        "Empty string is not a valid input",
        ErrorCode.VALIDATION_FAILED,
      );
    }
  }

  protected generatePaginatedResponse<T, U>(
    entries: U[],
    entriesTotalCount: number,
    input: PaginatedInputClassAbstract<T>,
  ): PaginatedResponseClassAbstract<U> {
    return {
      entriesTotalCount: entriesTotalCount,
      pageCount: Math.floor(entriesTotalCount / input.pageSize),
      currentPageIndex: input.pageIndex,
      pageSize: input.pageSize,
      entries: entries,
    };
  }
}
