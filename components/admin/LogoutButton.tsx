"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/logout", { method: "POST" })
    } finally {
      setLoading(false)
      router.push("/admin/login")
      router.refresh()
    }
  }

  return (
    <button onClick={onLogout} className="admin-logout-btn" disabled={loading}>
      {loading ? "⏳ Saliendo..." : "🚪 Salir"}
    </button>
  )
}


