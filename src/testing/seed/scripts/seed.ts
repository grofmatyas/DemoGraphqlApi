import { DatabaseConnector } from "../../../connector/database/connector";
import { getContainerGraphqlApi } from "../../../infrastructure/container/container";
import { ApiContainer } from "../../../infrastructure/container/decorators";
import { DatabaseSeeder } from "../seeder/databaseSeeder";

void (async () => {
  await getContainerGraphqlApi();
  const databaseConnector = ApiContainer.get(DatabaseConnector);

  const seeder = databaseConnector.getConnection().getSeeder();

  await seeder.seed(DatabaseSeeder);

  await databaseConnector.getConnection().close(true);
})();
