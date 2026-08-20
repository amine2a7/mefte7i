import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, dashboardPathForRole, verifySessionToken } from "@/lib/session";

const ROLE_PREFIXES = {
  AGENT: "/agent",
  ADMIN: "/admin",
} as const;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRole = (Object.keys(ROLE_PREFIXES) as (keyof typeof ROLE_PREFIXES)[]).find(
    (role) => pathname.startsWith(ROLE_PREFIXES[role]),
  );

  if (!matchedRole) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== matchedRole) {
    return NextResponse.redirect(new URL(dashboardPathForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*", "/admin/:path*"],
};
