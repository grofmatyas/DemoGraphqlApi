import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  PluginDefinition,
} from "apollo-server-core";
import { ApolloServer, Config } from "apollo-server-express";
import express from "express";
import depthLimit from "graphql-depth-limit";
import { createServer as createHttpServer, Server as HttpServer } from "http";

import { GraphqlContext } from "./context";
import { typeDefs } from "../../entrypoint/graphql/resolvers";
import { ContainerGraphqlApi } from "../../infrastructure/container/container";
import { ServerREST } from "../../infrastructure/rest/server";

export class ServerGraphql {
  private server?: ApolloServer;

  public constructor(private readonly container: ContainerGraphqlApi) {}

  public applyGraphqlMiddleware = async (
    serverRest: ServerREST,
  ): Promise<HttpServer> => {
    if (!serverRest.server) {
      throw new Error(
        "Could not initialize graphql server before initializing REST server first",
      );
    }
    const schema = await typeDefs;

    const httpServer = createHttpServer(serverRest.server);

    const apolloConfig: Config = {
      formatResponse: (response: any): any => {
        if (
          response.errors?.length > 0 &&
          response.errors[0].message === "Not Authorized"
        ) {
          return { ...response, data: null };
        }
      },
      schema: schema,
      context: async ({
        req,
        res,
      }: {
        req: express.Request;
        res: express.Response;
        connection: any;
      }): Promise<GraphqlContext> => ({
        res,
        config: this.container.config,
        container: this.container,
        logger: this.container.logger,
        req,
      }),
      validationRules: [depthLimit(8)],
      formatError: this.container.logger.apolloErrorHandler,
      introspection: this.container.config.system.environment !== "PROD",
      cache: "bounded",
      debug: this.container.config.system.environment === "DEVELOP",
      plugins: [
        this.container.logger.getPlugin("apollo") as PluginDefinition,
      ].concat(
        this.container.config.system.environment !== "PROD"
          ? ApolloServerPluginLandingPageGraphQLPlayground
          : [],
      ),
    };

    this.server = new ApolloServer(apolloConfig);

    await this.server.start();
    this.server.applyMiddleware({
      // @ts-expect-error Necessary because of different express version in Apollo and this repo
      app: serverRest.server,
      path: this.container.config.system.graphqlEndpoint,
      cors: {
        origin: (process.env.CLIENT_ORIGINS as string)?.split(";"),
        credentials: true,
      },
    });

    return httpServer;
  };
}
