import { DatabaseConnector } from "../../connector/database/connector";
import { getContainerGraphqlApi } from "../../infrastructure/container/container";
import { ApiContainer } from "../../infrastructure/container/decorators";

void (async () => {
  await getContainerGraphqlApi();
  const databaseConnector = ApiContainer.get(DatabaseConnector);
  const migrator = databaseConnector.getConnection().getMigrator();

  await migrator.up();

  await databaseConnector.getConnection().close(true);
})();
