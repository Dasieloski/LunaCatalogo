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

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem("admin", "true")
        router.push("/admin")
      } else {
        setError(data.error || "Credenciales inválidas")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e40af] p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#3b82f6] opacity-30 transform rotate-45 -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#60a5fa] opacity-20 transform -rotate-12 translate-x-32 translate-y-32" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#93c5fd] opacity-25 transform rotate-12" />

      <div className="bg-white border-4 border-[#0f172a] p-8 shadow-[8px_8px_0px_#0f172a] w-full max-w-md relative z-10">
        {/* Logo Area */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e40af] border-3 border-[#0f172a] p-4 shadow-[4px_4px_0px_#0f172a]">
            <span className="text-4xl">🌙</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-[#0f172a] uppercase tracking-tight text-center mb-2">
          Panel de Admin
        </h1>
        <p className="text-[#64748b] text-center mb-8 font-medium uppercase text-sm tracking-wide">
          Ingresa tus credenciales
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-bold text-[#0f172a] uppercase text-sm tracking-wide mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border-3 border-[#0f172a] bg-white text-[#0f172a] font-medium shadow-[3px_3px_0px_#1e40af] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_#1e40af] transition-all"
              placeholder="admin"
            />
          </div>

          <div className="mb-6">
            <label className="block font-bold text-[#0f172a] uppercase text-sm tracking-wide mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-3 border-[#0f172a] bg-white text-[#0f172a] font-medium shadow-[3px_3px_0px_#1e40af] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_#1e40af] transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#fee2e2] border-3 border-[#991b1b] text-[#991b1b] font-bold text-sm uppercase tracking-wide">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full p-4 font-extrabold text-lg uppercase tracking-wide border-3 border-[#0f172a] transition-all
              ${
                loading
                  ? "bg-[#94a3b8] text-white cursor-not-allowed"
                  : "bg-[#2563eb] text-white shadow-[4px_4px_0px_#0f172a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              }
            `}
          >
            {loading ? "⏳ Entrando..." : "🔐 Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}
