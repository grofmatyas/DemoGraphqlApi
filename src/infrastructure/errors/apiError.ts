import { ErrorCode } from "./errorMessages";

export class ApiError extends Error {
  public readonly isApiError = true;

  public constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message);
  }
}
