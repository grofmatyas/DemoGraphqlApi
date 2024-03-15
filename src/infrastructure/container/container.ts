import { ApiContainer } from "./decorators";
import { DatabaseConnector } from "../../connector/database/connector";
import { DatabaseDataProvider } from "../../dataProvider/database/dataProvider";
import { StatusController } from "../../entrypoint/rest/controllers/healthCheck";
import { OkController } from "../../entrypoint/rest/controllers/ok";
import { ApiConfig } from "../../infrastructure/config/config";
import { ApiLogger } from "../logger/logger";

export type ContainerGraphqlApi = {
  logger: ApiLogger;
  config: ApiConfig;
  databaseDataProvider: DatabaseDataProvider;
  controllers: {
    status: StatusController;
    ok: OkController;
  };
};

export const getContainerGraphqlApi =
  async (): Promise<ContainerGraphqlApi> => {
    const databaseConnector = ApiContainer.get(DatabaseConnector);

    await databaseConnector.init();

    return {
      logger: ApiContainer.get(ApiLogger),
      config: ApiContainer.get(ApiConfig),
      databaseDataProvider: ApiContainer.get(DatabaseDataProvider),
      controllers: {
        status: ApiContainer.get(StatusController),
        ok: ApiContainer.get(OkController),
      },
    };
  };
