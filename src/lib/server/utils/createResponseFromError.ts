import { ApplicationError } from "@/lib/shared/error";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { json } from "@/lib/utils/responseUtils";
import { ZodError } from "zod";

export function createResponseFromError(error: unknown): Response {
  if (error instanceof ApplicationError) {
    return (error as ApplicationError).toJsonResponse();
  }

  if (error instanceof ZodError) {
    return json(error.message, { status: 400 });
  }

  if (process.env.NODE_ENV === "production") {
    return json({ message: "Something went wrong" }, { status: 500 });
  }

  const message = getErrorMessage(error) ?? "Something went wrong";
  return json({ message }, { status: 500 });
}
