import { IsString } from "class-validator";

import { GraphqlField, GraphqlInputType } from "../../../graphqlDecorators";
import { TrainerInput } from "../../input/trainer";

@GraphqlInputType()
export class SetTrainerNicknameInput {
  @GraphqlField(() => String, {
    nullable: true,
    description: "Choose nickname. Set to `null` to remove nickname.",
  })
  @IsString()
  public nickname?: string;

  @GraphqlField(() => TrainerInput)
  public trainer: TrainerInput;
}
