import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import * as fastify from "fastify";
import * as https from "https";
import { IncomingMessage, ServerResponse } from "node:http";

import { RouterREST } from "./router/router";
import { ContainerGraphqlApi } from "../container/container";
import { ServerGraphql } from "../graphql/server";

export class ServerREST {
  public server?: fastify.FastifyInstance<
    https.Server<typeof IncomingMessage, typeof ServerResponse>,
    IncomingMessage,
    ServerResponse,
    fastify.FastifyBaseLogger,
    fastify.FastifyTypeProviderDefault
  >;

  public constructor(
    private readonly serverGraphql: ServerGraphql,
    private readonly router: RouterREST,
    private readonly container: ContainerGraphqlApi,
  ) {}

  public initServer = async (): Promise<void> => {
    this.server = fastify.fastify({
      logger: this.container.logger,
      disableRequestLogging:
        this.container.config.system.environment !== "PROD" &&
        this.container.config.system.environment !== "STAGE",
      trustProxy: true,
    });

    if (
      this.container.config.system.environment === "PROD" ||
      this.container.config.system.environment === "STAGE"
    ) {
      await this.server.register(helmet, { contentSecurityPolicy: false });
      await this.server.register(cors, {
        origin: this.container.config.system.clientOrigins?.split(";"),
        credentials: true,
      });
    }

    this.server.addHook("onRequest", (_request, _reply, done) => {
      this.container.logger.runTask(done);
    });

    this.server.addHook("onRequest", (_request, _reply, done) => {
      this.container.databaseDataProvider.createContext(done);
    });

    await this.server.register(swagger, {
      openapi: {
        info: {
          title: "OpenApi documentation",
          description: "OpenApi documentation",
          version: "1.0.0",
        },
      },
    });
    await this.server.register(swaggerUi, {
      prefix: this.container.config.system.docsEndpoint,
      uiConfig: {
        docExpansion: "full",
      },
    });

    // Simple and basic routes
    this.router.getBasicRoutes(this);

    // Apply Graphql Middleware
    await this.serverGraphql.applyGraphqlMiddleware(this);

    // Listen on http server
    this.server.listen(
      { port: this.container.config.system.listenOn },
      (err, address): void => {
        this.container.logger.info(
          `Docs listening at ${address}/${this.container.config.system.docsEndpoint}`,
        );
        if (err) {
          this.container.logger.fatal("Server start error", err);
          throw err;
        }
      },
    );
  };
}
