import { graphqlRegisterEnumType } from "../../entity/graphqlDecorators";

export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  GRAPHQL_VALIDATION_FAILED = "GRAPHQL_VALIDATION_FAILED",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

graphqlRegisterEnumType(ErrorCode, {
  name: "ErrorCode",
  description:
    "List of all possible error codes that can be returned by the API.",
  valuesConfig: {
    BAD_REQUEST: {
      description: "Bad Request",
    },
    GRAPHQL_VALIDATION_FAILED: {
      description: "Graphql Validation Failed",
    },
    NOT_AUTHORIZED: {
      description: "Not Authorized",
    },
    VALIDATION_FAILED: {
      description: "Validation Failed",
    },
    NOT_FOUND: {
      description: "Not Found",
    },
    INTERNAL_SERVER_ERROR: {
      description: "Internal Server Error",
    },
  },
});
