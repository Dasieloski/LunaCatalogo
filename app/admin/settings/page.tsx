"use client"

import { useEffect, useState } from "react"
import type { CatalogData } from "@/lib/types"
import { ToastContainer } from "@/components/admin/Toast"
import type { ToastType } from "@/components/admin/Toast"

interface Toast {
  id: string
  message: string
  type: ToastType
}

export default function SettingsPage() {
  const [data, setData] = useState<Partial<CatalogData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    loadSettings()
  }, [])

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const settings = await response.json()
      setData(settings)
    } catch (error) {
      console.error("Error al cargar configuración:", error)
      addToast("Error al cargar configuración", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        addToast("Configuración guardada exitosamente", "success")
      } else {
        addToast("Error al guardar configuración", "error")
      }
    } catch (error) {
      addToast("Error al guardar configuración", "error")
    } finally {
      setSaving(false)
    }
  }

  const addPhone = () => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        phones: [...(prev.contact?.phones || []), ""],
      },
    }))
  }

  const addWhatsApp = () => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        whatsapps: [...(prev.contact?.whatsapps || []), ""],
      },
    }))
  }

  const addCity = () => {
    setData((prev) => ({
      ...prev,
      nationalDelivery: {
        ...prev.nationalDelivery!,
        cities: [...(prev.nationalDelivery?.cities || []), { name: "", province: "" }],
      },
    }))
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

  return (
    <>
      <h1 className="admin-page-title">⚙️ Configuración</h1>

      <div className="admin-card">
        <h2 className="admin-card-title">🏢 Información de la Empresa</h2>

        <div className="admin-form-group">
          <label className="admin-form-label">Nombre de la Empresa</label>
          <input
            type="text"
            value={data.companyName || ""}
            onChange={(e) => setData({ ...data, companyName: e.target.value })}
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Tagline</label>
          <input
            type="text"
            value={data.companyTagline || ""}
            onChange={(e) => setData({ ...data, companyTagline: e.target.value })}
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Introducción del Catálogo</label>
          <textarea
            value={data.catalogIntro || ""}
            onChange={(e) => setData({ ...data, catalogIntro: e.target.value })}
            rows={4}
            className="admin-form-textarea"
          />
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">📞 Información de Contacto</h2>

        <div className="admin-form-group">
          <div className="flex justify-between items-center mb-4">
            <label className="admin-form-label mb-0">Teléfonos</label>
            <button type="button" onClick={addPhone} className="admin-btn admin-btn-success admin-btn-sm">
              ➕ Agregar
            </button>
          </div>
          {(data.contact?.phones || []).map((phone, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const phones = [...(data.contact?.phones || [])]
                  phones[index] = e.target.value
                  setData({ ...data, contact: { ...data.contact!, phones } })
                }}
                placeholder="+53 XXX XXX XXXX"
                className="admin-form-input flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const phones = data.contact?.phones?.filter((_, i) => i !== index) || []
                  setData({ ...data, contact: { ...data.contact!, phones } })
                }}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="admin-form-group">
          <div className="flex justify-between items-center mb-4">
            <label className="admin-form-label mb-0">WhatsApps</label>
            <button type="button" onClick={addWhatsApp} className="admin-btn admin-btn-success admin-btn-sm">
              ➕ Agregar
            </button>
          </div>
          {(data.contact?.whatsapps || []).map((whatsapp, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => {
                  const whatsapps = [...(data.contact?.whatsapps || [])]
                  whatsapps[index] = e.target.value
                  setData({ ...data, contact: { ...data.contact!, whatsapps } })
                }}
                placeholder="+53 XXX XXX XXXX"
                className="admin-form-input flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const whatsapps = data.contact?.whatsapps?.filter((_, i) => i !== index) || []
                  setData({ ...data, contact: { ...data.contact!, whatsapps } })
                }}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">🏍️ Mensajería en La Habana</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="admin-form-group">
            <label className="admin-form-label">Capacidad</label>
            <input
              type="text"
              value={data.localDelivery?.capacity || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  localDelivery: { ...data.localDelivery!, capacity: e.target.value },
                })
              }
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Rango de Precios</label>
            <input
              type="text"
              value={data.localDelivery?.priceRange || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  localDelivery: { ...data.localDelivery!, priceRange: e.target.value },
                })
              }
              className="admin-form-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="admin-card-title mb-0">🗺️ Distribución Nacional</h2>
          <button type="button" onClick={addCity} className="admin-btn admin-btn-success admin-btn-sm">
            ➕ Agregar Ciudad
          </button>
        </div>

        <div className="space-y-4">
          {(data.nationalDelivery?.cities || []).map((city, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div className="admin-form-group mb-0">
                <label className="admin-form-label">Ciudad</label>
                <input
                  type="text"
                  value={city.name}
                  onChange={(e) => {
                    const cities = [...(data.nationalDelivery?.cities || [])]
                    cities[index] = { ...cities[index], name: e.target.value }
                    setData({ ...data, nationalDelivery: { ...data.nationalDelivery!, cities } })
                  }}
                  placeholder="Nombre de la ciudad"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group mb-0">
                <label className="admin-form-label">Provincia</label>
                <input
                  type="text"
                  value={city.province}
                  onChange={(e) => {
                    const cities = [...(data.nationalDelivery?.cities || [])]
                    cities[index] = { ...cities[index], province: e.target.value }
                    setData({ ...data, nationalDelivery: { ...data.nationalDelivery!, cities } })
                  }}
                  placeholder="Provincia"
                  className="admin-form-input"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const cities = data.nationalDelivery?.cities?.filter((_, i) => i !== index) || []
                  setData({ ...data, nationalDelivery: { ...data.nationalDelivery!, cities } })
                }}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? "⏳ Guardando..." : "💾 Guardar Configuración"}
        </button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
