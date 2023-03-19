// `p` stands for `preferences`

import { NextResponse } from "next/server";

export function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const response = new NextResponse(undefined, {
    status: 204,
  });

  checkPrefersDarkMode(searchParams, response);

  return response;
}

// We let the user set a cookie to determine if they prefer dark mode or not,
// this way we can control from the server what theme we should serve

function checkPrefersDarkMode(
  searchParams: URLSearchParams,
  response: NextResponse
) {
  const prefersDarkMode = searchParams.get("dark");
  if (prefersDarkMode == null) {
    return;
  }

  // `true/false` are the only valid values
  if (!["true", "false"].includes(prefersDarkMode)) {
    return;
  }

  if (prefersDarkMode != null) {
    response.cookies.set("dark", String(prefersDarkMode), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
}
