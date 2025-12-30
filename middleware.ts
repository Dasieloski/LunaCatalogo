import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-session"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow the login page through
  if (pathname === "/admin/login") return NextResponse.next()

  const token = req.cookies.get(getAdminSessionCookieName())?.value
  const ok = await verifyAdminSessionToken(token)
  if (ok) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  url.search = ""
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*"],
}


