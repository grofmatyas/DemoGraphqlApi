import { config } from "dotenv-safe";
import * as path from "path";

import { ApiService } from "../container/decorators";

config({
  path: path.resolve(__dirname, "../../../.env"),
  sample: path.resolve(__dirname, "../../../.example.env"),
});

export type IEnvironment = "PROD" | "STAGE" | "TEST" | "DEVELOP";

@ApiService()
export class ApiConfig {
  public readonly system = {
    environment:
      process.env.NODE_ENV === "PROD"
        ? "PROD"
        : process.env.NODE_ENV === "STAGE"
          ? "STAGE"
          : process.env.NODE_ENV === "TEST"
            ? "TEST"
            : ("DEVELOP" as IEnvironment),
    listenOn: Number(process.env.LISTEN_ON) || 3000,
    clientOrigins: process.env.CLIENT_ORIGINS,
    worker: process.env.WORKER_ID,
    origin: process.env.ORIGIN,
    healthCheckEndpoint: "/health-check",
    graphqlEndpoint: "/v0/graphql",
    applicationName: "graphql-api",
  };

  public readonly application = {
    pagination: {
      limit: 50,
    },
    elastic: {
      host: process.env.ELASTIC_HOST,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
    },
    database: {
      entities: ["./dist/entity/**/*.entity.js"],
      entitiesTs: ["./src/entity/**/*.entity.ts"],
      dbName: "./data/sqlite_db",
      debug: this.system.environment === "TEST",
      migrations: {
        tableName: "mikro_orm_migrations",
        path: "./dist/migrations",
        pathTs: "./src/migrations",
        glob: "!(*.d).{js,ts}",
        transactional: true,
        disableForeignKeys: false,
        allOrNothing: true,
        dropTables: false,
        safe: false,
        snapshot: true,
        emit: "ts" as const,
      },
      seeder: {
        path: "./dist/testing/seed/seeder",
        pathTs: "./src/testing/seed/seeder",
        defaultSeeder: "DatabaseSeeder",
        glob: "!(*.d|*.test).{js,ts}",
        emit: "ts" as const,
      },
    },
  };
}
