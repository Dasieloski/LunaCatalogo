import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials } from '@/lib/auth'
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const isValid = await verifyCredentials(username, password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    const token = await createAdminSessionToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set(getAdminSessionCookieName(), token, getAdminSessionCookieOptions())
    return res
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en el login' },
      { status: 500 }
    )
  }
}
