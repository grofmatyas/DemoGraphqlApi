import { ContainerGraphqlApi } from "../../container/container";
import { ServerREST } from "../server";

export class RouterREST {
  public constructor(private readonly container: ContainerGraphqlApi) {}

  public getBasicRoutes = (server: ServerREST): void => {
    Object.values(this.container.controllers).forEach((controller) =>
      server.server?.route(controller),
    );
  };
}
