import { RESTReply, RESTRequest } from "../../entrypoint/rest/types";
import { ApiConfig } from "../../infrastructure/config/config";
import { ContainerGraphqlApi } from "../../infrastructure/container/container";
import { ApiLogger } from "../logger/logger";

export type GraphqlContext = {
  request: RESTRequest;
  reply: RESTReply;
  container: ContainerGraphqlApi;
  logger: ApiLogger;
  config: ApiConfig;
};
