import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { RouterREST } from "./router/router";
import { ContainerGraphqlApi } from "../container/container";
import { ServerGraphql } from "../graphql/server";

export class ServerREST {
  public server?: express.Application;

  public constructor(
    private readonly serverGraphql: ServerGraphql,
    private readonly router: RouterREST,
    private readonly container: ContainerGraphqlApi,
  ) {}

  public initServer = async (): Promise<void> => {
    this.server = express();

    // Add middlewares
    this.server.set("trust proxy", true);
    if (
      this.container.config.system.environment === "PROD" ||
      this.container.config.system.environment === "STAGE"
    ) {
      this.server.use(
        helmet({
          contentSecurityPolicy:
            this.container.config.system.environment === "STAGE"
              ? false
              : undefined,
        }),
      );
    }
    this.server.use(
      cors({
        origin: this.container.config.system.clientOrigins?.split(";"),
        credentials: true,
      }),
    );

    this.server.use(bodyParser.urlencoded({ extended: false }));

    this.server.use((_req, _res, next) => {
      this.container.databaseDataProvider.createContext(next);
    });

    // Simple and basic routes
    this.server.use(this.router.getBasicRoutes());

    // logging middlewares
    this.server.use(
      this.container.logger.getPlugin("express").createRequestHandler(),
    );
    this.server.use(
      this.container.logger.getPlugin("express").createErrorHandler(),
    );

    // Apply Graphql Middleware
    const httpServer = await this.serverGraphql.applyGraphqlMiddleware(this);

    // Listen on http server
    const listenCallback = (): void => {
      if (process.send) process.send("online");
      this.container.logger.info(
        `> Ready on http://${this.container.config.system.listenOn}`,
      );
    };

    httpServer.on("error", (err) => {
      throw err;
    });

    if (this.container.config.system.listenOn.includes(":")) {
      const [hostname, port] = this.container.config.system.listenOn.split(":");
      httpServer.listen(parseInt(port, 10), hostname, listenCallback);
    } else {
      httpServer.listen(this.container.config.system.listenOn, listenCallback);
    }
  };
}

export { NextFunction } from "express";
