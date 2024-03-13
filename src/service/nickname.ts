import { Service } from "./service";
import { DatabaseDataProvider } from "../dataProvider/database/dataProvider";
import { Trainer } from "../entity/base/trainer.entity";
import { ApiConfig } from "../infrastructure/config/config";
import { ApiService } from "../infrastructure/container/decorators";
import { ApiError } from "../infrastructure/errors/apiError";
import { ErrorCode } from "../infrastructure/errors/errorMessages";
import { ApiLogger } from "../infrastructure/logger/logger";

@ApiService()
export class NicknameService extends Service {
  public constructor(
    databaseDataProvider: DatabaseDataProvider,
    logger: ApiLogger,
    config: ApiConfig,
  ) {
    super(databaseDataProvider, logger, config);
  }

  public setTrainerNickname = async (
    trainer: Trainer,
    nickname?: string,
  ): Promise<void> => {
    if (nickname === "Ash") {
      throw new ApiError(
        "No one other than Ash should call himself Ash",
        ErrorCode.VALIDATION_FAILED,
      );
    }

    trainer.nickname = nickname;

    await this.databaseDataProvider
      .forkEntityManager()
      .persistAndFlush(trainer);

    // TODO: Handle problem that unflushed stuff is flushed in express middleware
  };
}
