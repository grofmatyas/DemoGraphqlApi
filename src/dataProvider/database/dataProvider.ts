import { ApiEntityManager } from "./entityManager";
import { DatabaseConnector } from "../../connector/database/connector";
import { ApiService } from "../../infrastructure/container/decorators";
import { NextFunction } from "../../infrastructure/rest/server";

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

  public createContext(next: NextFunction): any {
    return this.databaseConnector.createContext(next);
  }
}
