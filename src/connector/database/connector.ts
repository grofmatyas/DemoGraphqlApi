import { RequestContext } from "@mikro-orm/core";
import { Migrator, TSMigrationGenerator } from "@mikro-orm/migrations";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqliteDriver } from "@mikro-orm/sqlite";

import { DatabaseConnection } from "./connection";
import { ApiConfig } from "../../infrastructure/config/config";
import { ApiService } from "../../infrastructure/container/decorators";
import { NextFunction } from "../../infrastructure/rest/server";

@ApiService()
export class DatabaseConnector {
  private connection?: DatabaseConnection;

  public constructor(private readonly config: ApiConfig) {
    //
  }

  public async init(): Promise<void> {
    if (!this.connection) {
      this.connection = await DatabaseConnection.init({
        ...this.config.application.database,
        metadataProvider: TsMorphMetadataProvider,
        driver: SqliteDriver,
        migrations: {
          ...this.config.application.database.migrations,
          generator: TSMigrationGenerator,
        },
        extensions: [Migrator],
      });
    } else {
      throw new Error("Should init database connector only once");
    }
  }

  public getConnection(): DatabaseConnection {
    if (!this.connection) {
      throw new Error(
        "Unable to get database connection, application is not connected to database",
      );
    }

    return this.connection;
  }

  public createContext(next: NextFunction): any {
    return RequestContext.create(this.getConnection().em.fork(), next);
  }
}
