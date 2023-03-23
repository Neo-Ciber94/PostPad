export const enum ErrorCode {
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class ApplicationError extends Error {
  public constructor(message: string, public readonly code: ErrorCode) {
    super(message);
  }

  toJsonResponse() {
    const data = JSON.stringify({ message: this.message });
    return new Response(data, {
      headers: {
        "content-type": "application/json",
      },
      status: codeToStatusCode(this.code),
    });
  }
}

function codeToStatusCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.BAD_REQUEST:
      return 400;
    case ErrorCode.UNAUTHORIZED:
      return 401;
    case ErrorCode.FORBIDDEN:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.INTERNAL_SERVER_ERROR:
      return 500;
    default:
      throw new Error("invalid error code: " + code);
  }
}
