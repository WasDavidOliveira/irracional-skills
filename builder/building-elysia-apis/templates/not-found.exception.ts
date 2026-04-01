import { HttpError } from "../http-error";
import { HTTP_STATUS } from "../http-status.constants";

export class NotFoundException extends HttpError {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, message);
    this.name = "NotFoundException";
  }
}
