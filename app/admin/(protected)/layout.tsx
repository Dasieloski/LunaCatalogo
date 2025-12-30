import type React from "react"
import Link from "next/link"
import LogoutButton from "@/components/admin/LogoutButton"

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
            <Link href="/admin/images" className="admin-nav-link">
              🗂️ Imágenes
            </Link>
            <Link href="/catalog" target="_blank" className="admin-nav-link">
              👁️ Ver Catálogo
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </>
  )
}


