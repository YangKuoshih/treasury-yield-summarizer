import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionUser = request.cookies.get("session_user")?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionUser) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  if (pathname === "/login" || pathname === "/register") {
    if (sessionUser) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
