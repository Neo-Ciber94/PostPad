// export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";

// export const config = { matcher: ["/posts", "/api"] };

export default function () {
  return NextResponse.next();
}
