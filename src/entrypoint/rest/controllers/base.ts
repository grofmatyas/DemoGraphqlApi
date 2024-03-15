import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import { RESTReply, RESTRequest } from "../types";

@ApiService()
export abstract class BaseController {
  public constructor(
    protected readonly databaseDataProvider: DatabaseDataProvider,
    protected readonly logger: ApiLogger,
  ) {}

  public abstract method:
    | "DELETE"
    | "GET"
    | "HEAD"
    | "PATCH"
    | "POST"
    | "PUT"
    | "OPTIONS"
    | "SEARCH"
    | "TRACE"
    | "PROPFIND"
    | "PROPPATCH"
    | "MKCOL"
    | "COPY"
    | "MOVE"
    | "LOCK"
    | "UNLOCK";

  public abstract url: string;

  public abstract schema: Record<string, Record<string, any>>;

  public abstract handler: (
    request: RESTRequest,
    reply: RESTReply,
  ) => Promise<void>;

  protected get em() {
    return this.databaseDataProvider.getEntityManager();
  }

  protected removeUndefinedFromObject<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
  }
}
