import { ErrorWithProps } from "mercurius";

import { ErrorCode } from "./errorMessages";

export class ApiError extends ErrorWithProps {
  public readonly isApiError = true;

  public constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message, { code, isApiError: true });
  }
}
