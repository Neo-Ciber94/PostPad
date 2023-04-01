import { ApplicationError, ErrorCode } from "@/lib/shared/error";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";

export const userRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 request per minute
  analytics: true,
});

export async function rateLimitOrThrow(
  limiter: Ratelimit,
  identifier: string,
  message = "Too many requests"
) {
  const rateLimit = await limiter.limit(identifier);

  if (!rateLimit.success) {
    throw new ApplicationError(message, ErrorCode.TOO_MANY_REQUESTS);
  }
}

export async function limitUserRequest(cookies: RequestCookies | ReadonlyRequestCookies) {
  // Logic from: https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/jwt.ts
  const isSecureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const cookieName = isSecureCookie
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const requestIdentifier = cookies.get(cookieName)?.value;

  if (requestIdentifier == null) {
    throw new ApplicationError("Unable to process request", ErrorCode.BAD_REQUEST);
  }

  await rateLimitOrThrow(userRateLimiter, requestIdentifier);
}
