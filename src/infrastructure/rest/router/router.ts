import { Router } from "express";
import path from "path";

import { ContainerGraphqlApi } from "../../container/container";

const VERSION_FILE_PATH = path.resolve(__dirname, "../../../../build/.version");

type EnhancedExpressError = Error & {
  status?: number;
};

export class RouterREST {
  public constructor(private readonly container: ContainerGraphqlApi) {}

  public getBasicRoutes = (): Router =>
    Router()
      .get("/", (_req, res) => {
        res.send("ok");
      })
      .get(
        this.container.config.system.healthCheckEndpoint,
        (_req, res, next) => {
          res.sendFile(
            VERSION_FILE_PATH,
            { dotfiles: "allow" },
            (error: EnhancedExpressError) => {
              if (error?.status) {
                res.status(error.status).end();
              } else {
                next(error);
              }
            },
          );
        },
      );
}
