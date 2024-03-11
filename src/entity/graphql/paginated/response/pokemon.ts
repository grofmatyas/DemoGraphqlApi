import { PaginatedResponseFactory } from "./factory";
import { Pokemon } from "../../../base/pokemon.entity";
import { GraphqlEntity } from "../../../graphqlDecorators";

@GraphqlEntity()
export class PaginatedPokemonResponse extends PaginatedResponseFactory(
  Pokemon,
) {}
