import { BaseResolver } from "./base";
import { DatabaseDataProvider } from "../../../dataProvider/database/dataProvider";
import { Trainer } from "../../../entity/base/trainer.entity";
import { TrainerInput } from "../../../entity/graphql/input/trainer";
import { SetTrainerNicknameInput } from "../../../entity/graphql/mutation/input/setTrainerNickname";
import {
  PaginatedTrainersInput,
  TrainersInput,
} from "../../../entity/graphql/paginated/input/trainer";
import { PaginatedTrainerResponse } from "../../../entity/graphql/paginated/response/trainer";
import { ApiService } from "../../../infrastructure/container/decorators";
import { ApiError } from "../../../infrastructure/errors/apiError";
import { ErrorCode } from "../../../infrastructure/errors/errorMessages";
import { GraphqlContext } from "../../../infrastructure/graphql/context";
import { ApiLogger } from "../../../infrastructure/logger/logger";
import { NicknameService } from "../../../service/nickname";
import {
  GraphqlArg,
  GraphqlAuthorized,
  GraphqlCtx,
  GraphqlMutation,
  GraphqlQuery,
  GraphqlResolver,
} from "../decorators";

@GraphqlResolver()
@ApiService()
export class TrainerResolver extends BaseResolver {
  public constructor(
    databaseDataProvider: DatabaseDataProvider,
    private readonly nicknameService: NicknameService,
    logger: ApiLogger,
  ) {
    super(databaseDataProvider, logger);
  }

  @GraphqlQuery(() => Trainer)
  @GraphqlAuthorized()
  public async trainer(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => TrainerInput, { nullable: false })
    input: TrainerInput,
  ): Promise<Trainer> {
    this.sanitizeInput(input);

    const trainer = await this.databaseDataProvider
      .getEntityManager()
      .findOne(Trainer, {
        name: input.name,
      });

    if (trainer) {
      return trainer;
    }

    throw new ApiError("Trainer not found", ErrorCode.NOT_FOUND);
  }

  @GraphqlQuery(() => PaginatedTrainerResponse)
  @GraphqlAuthorized()
  public async trainers(
    @GraphqlCtx() _ctx: GraphqlContext,
    @GraphqlArg("input", () => TrainersInput, { nullable: true })
    input: PaginatedTrainersInput,
  ): Promise<PaginatedTrainerResponse> {
    this.sanitizeInput(input);

    const trainers = await this.databaseDataProvider
      .getEntityManager()
      .findAndCount(
        Trainer,
        {
          name: { $in: input.filter?.name_in },
        },
        {
          limit: input.pageSize,
          offset: input.pageIndex * input.pageSize,
        },
      );

    return this.generatePaginatedResponse(trainers[0], trainers[1], input);
  }

  @GraphqlMutation(() => Boolean)
  @GraphqlAuthorized()
  public async setTrainerNickname(
    @GraphqlArg("input", () => SetTrainerNicknameInput, { validate: true })
    input: SetTrainerNicknameInput,
    @GraphqlCtx() _ctx: GraphqlContext,
  ): Promise<boolean> {
    this.sanitizeInput(input);

    const trainer = await this.databaseDataProvider
      .getEntityManager()
      .findOne(Trainer, {
        $or: [
          {
            name: input.trainer.name,
          },
          {
            nickname: input.trainer.nickname,
          },
        ],
      });

    if (!trainer) {
      throw new ApiError("Trainer not found", ErrorCode.NOT_FOUND);
    }

    await this.nicknameService.setTrainerNickname(trainer, input.nickname);

    return true;
  }
}
