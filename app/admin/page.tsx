"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { CatalogData } from "@/lib/types"
import { ToastContainer } from "@/components/admin/Toast"
import type { ToastType } from "@/components/admin/Toast"

interface Toast {
  id: string
  message: string
  type: ToastType
}

export default function AdminDashboard() {
  const [data, setData] = useState<CatalogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const baseUrl = window.location.origin
      const response = await fetch(`/api/export-pdf?baseUrl=${baseUrl}`)

      if (!response.ok) {
        throw new Error("Error al generar PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "catalogo-luna.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      addToast("PDF exportado exitosamente", "success")
    } catch (error) {
      addToast("Error al exportar PDF", "error")
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white border-4 border-[#0f172a] p-8 shadow-[6px_6px_0px_#1e40af]">
          <p className="text-xl font-bold text-[#0f172a] uppercase tracking-wide animate-pulse">⏳ Cargando...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-[#fee2e2] border-4 border-[#991b1b] p-8 shadow-[6px_6px_0px_#991b1b]">
          <p className="text-xl font-bold text-[#991b1b] uppercase tracking-wide">❌ Error al cargar datos</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1 className="admin-page-title">📊 Dashboard</h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card blue">
          <div className="admin-stat-label">Total Productos</div>
          <div className="admin-stat-value">{data.products.length}</div>
        </div>

        <div className="admin-stat-card green">
          <div className="admin-stat-label">Productos Activos</div>
          <div className="admin-stat-value">
            {data.products.filter((p) => p.status === "active" || p.status === "offer").length}
          </div>
        </div>

        <div className="admin-stat-card red">
          <div className="admin-stat-label">En Oferta</div>
          <div className="admin-stat-value">{data.products.filter((p) => p.status === "offer").length}</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">⚡ Acciones Rápidas</h2>
        <div className="admin-quick-actions">
          <Link href="/admin/products" className="admin-btn admin-btn-primary">
            📦 Gestionar Productos
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn-primary">
            ⚙️ Configuración
          </Link>
          <Link href="/catalog" target="_blank" className="admin-btn admin-btn-success">
            👁️ Ver Catálogo
          </Link>
          <button onClick={handleExportPDF} disabled={exporting} className="admin-btn admin-btn-danger">
            {exporting ? "⏳ Generando..." : "📄 Exportar PDF"}
          </button>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
