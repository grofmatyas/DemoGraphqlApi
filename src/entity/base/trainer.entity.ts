import { ApiBaseEntity } from "./baseEntity";
import { Pokemon } from "./pokemon.entity";
import { GraphqlEntity, GraphqlField } from "../graphqlDecorators";
import {
  OrmCollection,
  OrmEntity,
  OrmIndex,
  OrmManyToMany,
  OrmProperty,
  OrmUnique,
} from "../ormDecorators";

@GraphqlEntity()
@OrmEntity()
@OrmIndex({ properties: ["name"] })
@OrmUnique({ properties: ["name"] })
export class Trainer extends ApiBaseEntity {
  @GraphqlField()
  @OrmProperty()
  name!: string;

  @GraphqlField({ nullable: true })
  @OrmProperty({ nullable: true })
  nickname?: string;

  @GraphqlField(() => [Pokemon])
  @OrmManyToMany(() => Pokemon)
  pokedex: OrmCollection<Pokemon> = new OrmCollection<Pokemon>(this);
}
