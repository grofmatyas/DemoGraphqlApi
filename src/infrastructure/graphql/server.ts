import { FastifyRegisterOptions } from "fastify";
import mercurius, { MercuriusOptions } from "mercurius";

import { GraphqlContext } from "./context";
import { typeDefs } from "../../entrypoint/graphql/resolvers";
import { RESTReply, RESTRequest } from "../../entrypoint/rest/types";
import { ContainerGraphqlApi } from "../../infrastructure/container/container";
import { ServerREST } from "../../infrastructure/rest/server";

export class ServerGraphql {
  public constructor(private readonly container: ContainerGraphqlApi) {}

  public applyGraphqlMiddleware = async (
    serverRest: ServerREST,
  ): Promise<void> => {
    if (!serverRest.server) {
      throw new Error(
        "Could not initialize graphql server before initializing REST server first",
      );
    }
    const schema = await typeDefs;

    const options: FastifyRegisterOptions<MercuriusOptions> = {
      schema,
      graphiql: this.container.config.system.environment !== "PROD",
      queryDepth: 8,
      routes: true,
      path: this.container.config.system.graphqlEndpoint,
      errorFormatter: this.container.logger.graphqlErrorFormatter,
      context: async (
        request: RESTRequest,
        reply: RESTReply,
      ): Promise<GraphqlContext> => {
        return {
          request,
          reply,
          config: this.container.config,
          container: this.container,
          logger: this.container.logger,
        };
      },
    };

    await serverRest.server.register(mercurius, options);
  };
}
