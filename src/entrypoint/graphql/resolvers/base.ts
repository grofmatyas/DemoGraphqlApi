import { GraphQLResolveInfo } from "graphql";
import fieldsToRelations from "graphql-fields-to-relations";

import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { PaginatedInputClassAbstract } from "../../../entity/graphql/paginated/input/factory";
import { PaginatedResponseClassAbstract } from "../../../entity/graphql/paginated/response/factory";
import { Populate } from "../../../entity/ormDecorators";
import { ApiService } from "../../../infrastructure/container/decorators";
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

  protected fieldsToRelations<T extends Record<string, any>>(
    input: GraphQLResolveInfo,
    options?: {
      depth?: number | undefined;
      root?: string | undefined;
      excludeFields?: string[] | undefined;
    },
  ): Populate<T, string> | undefined {
    // @ts-expect-error Error due to different graphql version in graphql-fields-to-relations that in my repo
    return fieldsToRelations(input, options);
  }

  protected removeUndefinedFromObject<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
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
