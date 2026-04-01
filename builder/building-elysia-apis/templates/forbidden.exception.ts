import { HttpError } from "../http-error";
import { HTTP_STATUS } from "../http-status.constants";

export class ForbiddenException extends HttpError {
  constructor(message: string) {
    super(HTTP_STATUS.FORBIDDEN, message);
    this.name = "ForbiddenException";
  }
}
