import { IsString, MinLength } from "class-validator";

import { GraphqlField, GraphqlInputType } from "../../graphqlDecorators";

@GraphqlInputType()
export class TrainerInput {
  @GraphqlField(() => String, { nullable: true })
  @IsString()
  @MinLength(1)
  public name?: string;

  @GraphqlField(() => String, {
    nullable: true,
  })
  @IsString()
  @MinLength(1)
  public nickname?: string;
}
