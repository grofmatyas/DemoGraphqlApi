import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

import { PokemonFactory } from "../factory/pokemon";
import { TrainerFactory } from "../factory/trainer";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const trainers = new TrainerFactory(em).make(10);
    const pokemons = new PokemonFactory(em).make(50);

    trainers[0].nickname = "Ash";
    trainers[0].pokedex.set(pokemons);
  }
}
