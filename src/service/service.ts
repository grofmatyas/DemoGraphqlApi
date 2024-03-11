import { DatabaseDataProvider } from "../dataProvider/database/dataProvider";
import { ApiConfig } from "../infrastructure/config/config";
import { ApiService } from "../infrastructure/container/decorators";
import { ApiLogger } from "../infrastructure/logger/logger";

@ApiService()
export class Service {
  public constructor(
    protected readonly databaseDataProvider: DatabaseDataProvider,
    protected logger: ApiLogger,
    protected config: ApiConfig,
  ) {}

  public get em() {
    return this.databaseDataProvider.getEntityManager();
  }
}
