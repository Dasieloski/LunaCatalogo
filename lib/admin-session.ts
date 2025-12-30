const COOKIE_NAME = "luna_admin_session"
const TOKEN_VERSION = "v1"

const encoder = new TextEncoder()

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  const base64 = btoa(binary)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlDecode(input: string): Uint8Array {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  if (pad) base64 += "=".repeat(4 - pad)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmacSha256Base64Url(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  return base64UrlEncode(new Uint8Array(sig))
}

function randomNonceBase64Url(bytes = 16): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return base64UrlEncode(arr)
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME
}

export function getAdminSessionSecret() {
  // MUST be stable across deployments. Set this in Vercel env vars.
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me"
}

export async function createAdminSessionToken(opts?: { nowMs?: number; nonce?: string }): Promise<string> {
  const secret = getAdminSessionSecret()
  const issuedAt = String(opts?.nowMs ?? Date.now())
  const nonce = opts?.nonce ?? randomNonceBase64Url()
  const payload = `${TOKEN_VERSION}.${issuedAt}.${nonce}`
  const sig = await hmacSha256Base64Url(secret, payload)
  return `${payload}.${sig}`
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
  opts?: { maxAgeMs?: number; nowMs?: number },
): Promise<boolean> {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 4) return false
  const [version, issuedAtRaw, nonce, sig] = parts
  if (version !== TOKEN_VERSION) return false
  if (!issuedAtRaw || !nonce || !sig) return false

  const issuedAt = Number(issuedAtRaw)
  if (!Number.isFinite(issuedAt)) return false

  const nowMs = opts?.nowMs ?? Date.now()
  const maxAgeMs = opts?.maxAgeMs ?? 1000 * 60 * 60 * 24 * 7 // 7 days
  if (issuedAt > nowMs + 5_000) return false
  if (nowMs - issuedAt > maxAgeMs) return false

  const payload = `${version}.${issuedAtRaw}.${nonce}`
  const expectedSig = await hmacSha256Base64Url(getAdminSessionSecret(), payload)
  return sig === expectedSig
}

export function getAdminSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production"
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  }
}


