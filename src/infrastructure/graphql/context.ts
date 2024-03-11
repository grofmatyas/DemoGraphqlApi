import express from "express";

import { ApiConfig } from "../../infrastructure/config/config";
import { ContainerGraphqlApi } from "../../infrastructure/container/container";
import { ApiLogger } from "../logger/logger";

export type GraphqlContext = {
  req: express.Request;
  res: express.Response;
  container: ContainerGraphqlApi;
  logger: ApiLogger;
  config: ApiConfig;
};
