import { HttpError } from "../http-error";
import { HTTP_STATUS } from "../http-status.constants";

export class UnauthorizedException extends HttpError {
  constructor(message: string) {
    super(HTTP_STATUS.UNAUTHORIZED, message);
    this.name = "UnauthorizedException";
  }
}
