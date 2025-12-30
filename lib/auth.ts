import bcrypt from 'bcryptjs'

// Credenciales por defecto (cambiar en producción)
const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME || DEFAULT_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD

  // En producción, esto debería verificar contra una base de datos.
  // Por ahora, comparación simple (pero configurable por env vars en Vercel).
  if (username !== expectedUsername) return false
  return password === expectedPassword
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
