import { HttpError } from "../http-error";

export function httpErrorResponse(error: HttpError) {
  return {
    status: error.statusCode,
    body: {
      error: error.name,
      message: error.message,
    },
  };
}
