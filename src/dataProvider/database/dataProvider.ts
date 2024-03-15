import { ApiEntityManager } from "./entityManager";
import { DatabaseConnector } from "../../connector/database/connector";
import { ApiService } from "../../infrastructure/container/decorators";

@ApiService()
export class DatabaseDataProvider {
  public constructor(private readonly databaseConnector: DatabaseConnector) {
    //
  }

  public forkEntityManager(): ApiEntityManager {
    return this.databaseConnector.getConnection().em.fork();
  }

  public getEntityManager(): ApiEntityManager {
    return this.databaseConnector.getConnection().em;
  }

  public createContext(
    next: <TError extends Error>(err?: TError) => void,
  ): any {
    return this.databaseConnector.createContext(next);
  }
}
