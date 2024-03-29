import { GraphQLResolveInfo } from "graphql";

import { BaseResolver } from "./base";
import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { Pokemon } from "../../../entity/base/pokemon.entity";
import { PokemonInput } from "../../../entity/graphql/input/pokemon";
import { PaginatedPokemonsInput } from "../../../entity/graphql/paginated/input/pokemon";
import { PaginatedPokemonResponse } from "../../../entity/graphql/paginated/response/pokemon";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiError } from "../../../infrastructure/errors/apiError";
import { ErrorCode } from "../../../infrastructure/errors/errorMessages";
import { GraphqlContext } from "../../../infrastructure/graphql/context";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import {
  GraphqlArg,
  GraphqlAuthorized,
  GraphqlCtx,
  GraphqlInfo,
  GraphqlQuery,
  GraphqlResolver,
} from "../decorators";

@GraphqlResolver()
@ApiService()
export class PokemonResolver extends BaseResolver {
  public constructor(
    databaseDataProvider: DatabaseDataProvider,
    logger: ApiLogger,
  ) {
    super(databaseDataProvider, logger);
  }

  @GraphqlQuery(() => Pokemon)
  @GraphqlAuthorized()
  public async pokemon(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => PokemonInput, { nullable: false })
    input: PokemonInput,
    @GraphqlInfo() info: GraphQLResolveInfo,
  ): Promise<Pokemon> {
    const pokemon = await this.databaseDataProvider.getEntityManager().findOne(
      Pokemon,
      {
        name: input.name,
      },
      { populate: this.fieldsToRelations<Pokemon>(info) },
    );

    if (pokemon) {
      return pokemon;
    }

    throw new ApiError("Pokemon not found", ErrorCode.NOT_FOUND);
  }

  @GraphqlQuery(() => PaginatedPokemonResponse)
  @GraphqlAuthorized()
  public async pokemons(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => PaginatedPokemonsInput, { nullable: true })
    input: PaginatedPokemonsInput,
    @GraphqlInfo() info: GraphQLResolveInfo,
  ): Promise<PaginatedPokemonResponse> {
    const pokemons = await this.databaseDataProvider
      .getEntityManager()
      .findAndCount(
        Pokemon,
        this.removeUndefinedFromObject({
          name: input.filter?.name_in
            ? { $in: input.filter?.name_in }
            : undefined,
        }),
        {
          limit: input.pageSize,
          offset: input.pageIndex * input.pageSize,
          populate: this.fieldsToRelations<Pokemon>(info, { root: "entries" }),
        },
      );

    return this.generatePaginatedResponse(pokemons[0], pokemons[1], input);
  }
}
