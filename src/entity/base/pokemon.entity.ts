import { ApiBaseEntity } from "./baseEntity";
import { Trainer } from "./trainer.entity";
import { PokemonType } from "../enum/pokemonType";
import { Float, GraphqlEntity, GraphqlField } from "../graphqlDecorators";
import {
  OrmCollection,
  OrmEntity,
  OrmEnum,
  OrmManyToMany,
  OrmProperty,
  OrmIndex,
  OrmUnique,
} from "../ormDecorators";

@GraphqlEntity()
@OrmEntity()
@OrmIndex({ properties: ["name"] })
@OrmUnique({ properties: ["name"] })
export class Pokemon extends ApiBaseEntity {
  @GraphqlField()
  @OrmProperty()
  name!: string;

  @GraphqlField(() => Float)
  @OrmProperty()
  height!: number;

  @GraphqlField(() => Float)
  @OrmProperty()
  weight!: number;

  @GraphqlField(() => PokemonType)
  @OrmEnum(() => PokemonType)
  primaryType!: PokemonType;

  @GraphqlField(() => PokemonType, { nullable: true })
  @OrmEnum({ nullable: true, items: () => PokemonType })
  secondaryType?: PokemonType;

  @GraphqlField(() => [Trainer])
  @OrmManyToMany(() => Trainer, (x) => x.pokedex)
  caughtBy = new OrmCollection<Trainer>(this);
}
