import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  const { origin, pathname } = req.nextUrl;

  // https://web.dev/user-preference-media-features-headers/
  headers.append("Accept-CH", "Sec-CH-Prefers-Color-Scheme");

  // We skip the user preferences and shared posts
  if (pathname.startsWith("/p")) {
    return NextResponse.next({ headers });
  }

  // We also skip the shared posts
  if (pathname.startsWith("/s/")) {
    // Skip the leading slash and skip empty paths
    // const pathSegments = pathname.split("/").filter(Boolean);
    return NextResponse.next({ headers });
  }

  // This is only returning the token is `raw: true`, not sure why.
  // https://github.com/nextauthjs/next-auth/issues/523
  const token = await getToken({ req, raw: true });

  if (token == null && pathname !== "/" && !pathname.startsWith("/api/auth/")) {
    return NextResponse.redirect(origin);
  }

  return NextResponse.next({
    headers,
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/og (image generation)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/og).*)"
  ],
};
