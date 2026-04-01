import type { HttpStatusValue } from "./http-status.constants";

export class HttpError extends Error {
  readonly statusCode: HttpStatusValue;

  constructor(statusCode: HttpStatusValue, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
