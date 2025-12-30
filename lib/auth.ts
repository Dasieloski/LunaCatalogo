import bcrypt from 'bcryptjs'

// Credenciales por defecto (cambiar en producción)
const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  // En producción, esto debería verificar contra una base de datos
  if (username !== DEFAULT_USERNAME) {
    return false
  }
  
  // En producción, comparar con hash guardado
  // Por ahora, comparación simple
  return password === DEFAULT_PASSWORD
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
