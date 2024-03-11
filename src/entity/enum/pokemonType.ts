import { graphqlRegisterEnumType } from "../graphqlDecorators";

export enum PokemonType {
  electric = "electric",
  water = "water",
  fire = "fire",
  // and crazy amount of more :)
}

graphqlRegisterEnumType(PokemonType, {
  name: "PokemonType",
});
