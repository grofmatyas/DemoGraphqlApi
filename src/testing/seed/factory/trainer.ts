import { faker } from "@faker-js/faker";
import { Factory } from "@mikro-orm/seeder";

import { Trainer } from "../../../entity/base/trainer.entity";

export class TrainerFactory extends Factory<Trainer> {
  model = Trainer;

  definition(): Partial<Trainer> {
    return {
      name: faker.person.firstName(),
    };
  }
}
