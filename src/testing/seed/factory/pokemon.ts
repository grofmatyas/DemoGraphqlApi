import { faker } from "@faker-js/faker";
import { Factory } from "@mikro-orm/seeder";

import { Pokemon } from "../../../entity/base/pokemon.entity";
import { PokemonType } from "../../../entity/enum/pokemonType";

export class PokemonFactory extends Factory<Pokemon> {
  model = Pokemon;

  definition(): Partial<Pokemon> {
    return {
      name: faker.person.firstName(),
      height: faker.number.float(),
      weight: faker.number.float(),
      primaryType: faker.helpers.enumValue(PokemonType),
    };
  }
}
