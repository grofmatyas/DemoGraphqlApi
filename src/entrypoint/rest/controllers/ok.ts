import { BaseController } from "./base";
import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import { RESTReply, RESTRequest } from "../types";

@ApiService()
export class OkController extends BaseController {
  public constructor(
    databaseDataProvider: DatabaseDataProvider,
    logger: ApiLogger,
  ) {
    super(databaseDataProvider, logger);
  }

  public method = "GET" as const;

  public url: string = "/";

  public handler = async (
    _request: RESTRequest,
    reply: RESTReply,
  ): Promise<void> => {
    reply.send({ status: "ok" });
  };

  public schema: Record<string, Record<string, any>> = {
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
        },
      },
    },
  };
}
