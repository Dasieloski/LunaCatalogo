"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        setError((data as any)?.error || "Credenciales inválidas")
      }
    } catch {
      setError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-logo">🌙</div>
        <h1 className="admin-auth-title">Panel de Admin</h1>
        <p className="admin-auth-subtitle">Ingresa tus credenciales</p>

        {error ? <div className="admin-alert admin-alert-error">❌ {error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="admin-form-input"
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-form-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-auth-submit">
            {loading ? "⏳ Entrando..." : "🔐 Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}


