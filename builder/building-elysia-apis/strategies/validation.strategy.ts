import type { ZodError } from "zod";
import { HTTP_STATUS } from "../http-status.constants";

export function validationErrorResponse(error: ZodError) {
  return {
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    body: {
      error: "VALIDATION_ERROR",
      message: error.message,
      issues: error.issues,
    },
  };
}
