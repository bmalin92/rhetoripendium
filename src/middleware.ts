import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  const sessionId = existing ?? crypto.randomUUID();

  if (!existing) {
    // Propagate the new cookie onto the request itself so Server Components
    // and Route Handlers further down the SAME request see it immediately,
    // instead of only on the next request after the browser stores it.
    request.cookies.set(SESSION_COOKIE, sessionId);
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  if (!existing) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
