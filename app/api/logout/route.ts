import { NextResponse } from "next/server"
import { getAdminSessionCookieName, getAdminSessionCookieOptions } from "@/lib/admin-session"

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(getAdminSessionCookieName(), "", { ...getAdminSessionCookieOptions(), maxAge: 0 })
  return res
}


