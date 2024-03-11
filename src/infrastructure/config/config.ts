import { config } from "dotenv-safe";
import * as path from "path";

import { ApiService } from "../container/decorators";

config({
  path: path.resolve(__dirname, "../../../.env"),
  sample: path.resolve(
    __dirname,
    process.env.NODE_ENV === "test"
      ? "../../testing/.test.example.env"
      : "../../../.example.env",
  ),
});

export type IEnvironment = "PROD" | "STAGE" | "TEST" | "DEVELOP";

@ApiService()
export class ApiConfig {
  public readonly system = {
    environment:
      process.env.ENVIRONMENT === "PROD"
        ? "PROD"
        : process.env.ENVIRONMENT === "STAGE"
          ? "STAGE"
          : process.env.ENVIRONMENT === "TEST"
            ? "TEST"
            : ("DEVELOP" as IEnvironment),
    listenOn: process.env.LISTEN_ON || "3000",
    clientOrigins: process.env.CLIENT_ORIGINS,
    worker: process.env.WORKER_ID,
    origin: process.env.ORIGIN,
    healthCheckEndpoint: "/.version",
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
      entities: ["./src/entity/**/*.entity.js"],
      entitiesTs: ["./src/entity/**/*.entity.ts"],
      dbName: "sqlite.db",
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
    },
  };
}