"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import "@/styles/admin.css"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const admin = sessionStorage.getItem("admin")
    if (!admin && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  const handleLogout = () => {
    sessionStorage.removeItem("admin")
    router.push("/admin/login")
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="admin-nav-content">
          <h1 className="admin-nav-title">🌙 Panel Luna</h1>
          <div className="admin-nav-links">
            <Link href="/admin" className="admin-nav-link">
              📊 Dashboard
            </Link>
            <Link href="/admin/products" className="admin-nav-link">
              📦 Productos
            </Link>
            <Link href="/admin/settings" className="admin-nav-link">
              ⚙️ Config
            </Link>
            <Link href="/admin/image-editor" className="admin-nav-link">
              🖼️ Editor
            </Link>
            <Link href="/catalog" target="_blank" className="admin-nav-link">
              👁️ Ver Catálogo
            </Link>
            <button onClick={handleLogout} className="admin-logout-btn">
              🚪 Salir
            </button>
          </div>
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  )
}
