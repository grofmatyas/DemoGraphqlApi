import { BaseResolver } from "./base";
import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { Pokemon } from "../../../entity/base/pokemon.entity";
import { PokemonInput } from "../../../entity/graphql/input/pokemon";
import {
  PaginatedPokemonsInput,
  PokemonsInput,
} from "../../../entity/graphql/paginated/input/pokemon";
import { PaginatedPokemonResponse } from "../../../entity/graphql/paginated/response/pokemon";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiError } from "../../../infrastructure/errors/apiError";
import { ErrorCode } from "../../../infrastructure/errors/errorMessages";
import { GraphqlContext } from "../../../infrastructure/graphql/context";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import {
  GraphqlArg,
  GraphqlCtx,
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
  public async pokemon(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => PokemonInput, { nullable: false })
    input: PokemonInput,
  ): Promise<Pokemon> {
    const pokemon = await this.databaseDataProvider
      .getEntityManager()
      .findOne(Pokemon, {
        name: input.name,
      });

    if (pokemon) {
      return pokemon;
    }

    throw new ApiError("Pokemon not found", ErrorCode.NOT_FOUND);
  }

  @GraphqlQuery(() => PaginatedPokemonResponse)
  public async pokemons(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => PokemonsInput, { nullable: true })
    input: PaginatedPokemonsInput,
  ): Promise<PaginatedPokemonResponse> {
    const pokemons = await this.databaseDataProvider
      .getEntityManager()
      .findAndCount(
        Pokemon,
        {
          name: { $in: input.filter?.name_in },
        },
        {
          limit: input.pageSize,
          offset: input.pageIndex * input.pageSize,
        },
      );

    return this.generatePaginatedResponse(pokemons[0], pokemons[1], input);
  }
}
