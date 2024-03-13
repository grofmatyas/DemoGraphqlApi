import { IsString, MinLength } from "class-validator";

import PaginatedInputFactory from "./factory";
import { GraphqlField, GraphqlInputType } from "../../../graphqlDecorators";

@GraphqlInputType()
class TrainersInput {
  @GraphqlField(() => [String], { nullable: true })
  @IsString({ each: true })
  @MinLength(1, { each: true })
  public name_in?: string[];

  @GraphqlField(() => [String], { nullable: true })
  @IsString({ each: true })
  @MinLength(1, { each: true })
  public nickname_in?: string[];
}

@GraphqlInputType()
export class PaginatedTrainersInput extends PaginatedInputFactory(
  TrainersInput,
) {}
