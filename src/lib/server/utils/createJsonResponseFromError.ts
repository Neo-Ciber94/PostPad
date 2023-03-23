import { ApplicationError } from "@/lib/shared/error";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { json } from "@/lib/utils/responseUtils";

import { ZodError } from "zod";

export function createJsonResponseFromError(error: unknown): Response {
  if (error instanceof ApplicationError) {
    return (error as ApplicationError).toJsonResponse();
  }

  if (error instanceof ZodError) {
    return json(error.message, { status: 400 });
  }

  const data = { message: getErrorMessage(error) };
  return json(data, { status: 500 });
}
