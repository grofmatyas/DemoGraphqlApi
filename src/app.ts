import "reflect-metadata";

import { getContainerGraphqlApi } from "./infrastructure/container/container";
import { ServerGraphql } from "./infrastructure/graphql/server";
import { RouterREST } from "./infrastructure/rest/router/router";
import { ServerREST } from "./infrastructure/rest/server";

const shutdownServer = (): never => {
  if (process.send) {
    process.send("offline");
  }

  process.exit(0);
};

process.on("message", (message) => {
  if (message === "shutdown") {
    process.exit(0);
  }
});

const initiateServer = async (): Promise<void> => {
  // Init Container
  const container = await getContainerGraphqlApi();

  // Init Graphql and REST
  const serverGraphql = new ServerGraphql(container);
  const routerREST = new RouterREST(container);
  const serverREST = new ServerREST(serverGraphql, routerREST, container);
  await serverREST.initServer();

  // Shutdown and error procedures
  process.on("uncaughtException", (err) => {
    container.logger.error("Caught exception", err);
    shutdownServer();
  });
};

initiateServer();
