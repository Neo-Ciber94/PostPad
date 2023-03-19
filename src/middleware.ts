// export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);

  // https://web.dev/user-preference-media-features-headers/
  headers.append("Accept-CH", "Sec-CH-Prefers-Color-Scheme");

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
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
