import { IsString, MinLength } from "class-validator";

import { GraphqlField, GraphqlInputType } from "../../graphqlDecorators";

@GraphqlInputType()
export class PokemonInput {
  @GraphqlField(() => String, { nullable: false })
  @IsString()
  @MinLength(1)
  public name: string;
}
