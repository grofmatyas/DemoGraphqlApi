import { AuthorizationChecker } from "./authorization";
import { NonEmptyArray, buildGraphqlSchema } from "./decorators";
import { ErrorResolver } from "./resolvers/error";
import { PokemonResolver } from "./resolvers/pokemon";
import { TrainerResolver } from "./resolvers/trainer";
import { ApiContainer } from "../../infrastructure/container/decorators";

// For type compatibility with type-graphql package
// eslint-disable-next-line @typescript-eslint/ban-types
const resolversArray: NonEmptyArray<Function> = [
  PokemonResolver,
  TrainerResolver,
  ErrorResolver,
];

export const typeDefs = buildGraphqlSchema({
  resolvers: resolversArray,
  container: ApiContainer,
  validate: { forbidUnknownValues: false },
  authChecker: AuthorizationChecker,
});
