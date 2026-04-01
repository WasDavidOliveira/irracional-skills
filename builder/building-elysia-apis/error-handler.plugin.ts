import { Elysia } from "elysia";
import { ZodError } from "zod";
import { HttpError } from "./http-error";
import { HTTP_STATUS } from "./http-status.constants";
import { httpErrorResponse } from "./strategies/default-http-error.strategy";
import { validationErrorResponse } from "./strategies/validation.strategy";

export const errorHandlerPlugin = new Elysia({ name: "error-handler" }).onError(
  { as: "global" },
  ({ error, set }) => {
    if (error instanceof ZodError) {
      const result = validationErrorResponse(error);
      set.status = result.status;
      return result.body;
    }
    if (error instanceof HttpError) {
      const result = httpErrorResponse(error);
      set.status = result.status;
      return result.body;
    }
    if (error instanceof SyntaxError) {
      set.status = HTTP_STATUS.BAD_REQUEST;
      return {
        error: "INVALID_PAYLOAD",
        message: error.message,
      };
    }
    set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return {
      error: "INTERNAL_ERROR",
      message: "Unexpected error",
    };
  },
);
