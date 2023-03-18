// export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";

// export const config = { matcher: ["/posts", "/api"] };

export default function middleware() {
  return NextResponse.next();
}
