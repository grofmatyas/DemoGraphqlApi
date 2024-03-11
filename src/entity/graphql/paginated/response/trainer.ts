import { PaginatedResponseFactory } from "./factory";
import { Trainer } from "../../../base/trainer.entity";
import { GraphqlEntity } from "../../../graphqlDecorators";

@GraphqlEntity()
export class PaginatedTrainerResponse extends PaginatedResponseFactory(
  Trainer,
) {}
