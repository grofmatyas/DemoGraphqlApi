import { GraphqlAuthCheckerInterface, GraphqlResolverData } from "./decorators";
import { ApiService } from "../../infrastructure/container/decorators";
import { ApiError } from "../../infrastructure/errors/apiError";
import { ErrorCode } from "../../infrastructure/errors/errorMessages";
import { GraphqlContext } from "../../infrastructure/graphql/context";

@ApiService()
export class AuthorizationChecker
  implements GraphqlAuthCheckerInterface<GraphqlContext>
{
  check({ context }: GraphqlResolverData<GraphqlContext>, _roles: string[]) {
    const token = context.request.headers.authorization;
    if (!token) {
      throw new ApiError(
        "Missing authorization token",
        ErrorCode.NOT_AUTHORIZED,
      );
    }

    if (!token.includes("Bearer")) {
      throw new ApiError("Invalid token format", ErrorCode.NOT_AUTHORIZED);
    }

    return true;
  }
}
