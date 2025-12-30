import type React from "react"
import "@/styles/admin.css"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Shared admin styles (including login) live in styles/admin.css
  return <div className="admin-container">{children}</div>
}
