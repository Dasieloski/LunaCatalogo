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
      <div className="admin-card">
        <p className="admin-card-title">⏳ Cargando...</p>
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
          <div className="admin-page-header" style={{ marginBottom: "1rem" }}>
            <label className="admin-form-label" style={{ margin: 0 }}>
              Teléfonos
            </label>
            <button type="button" onClick={addPhone} className="admin-btn admin-btn-success admin-btn-sm">
              ➕ Agregar
            </button>
          </div>
          {(data.contact?.phones || []).map((phone, index) => (
            <div key={index} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const phones = [...(data.contact?.phones || [])]
                  phones[index] = e.target.value
                  setData({ ...data, contact: { ...data.contact!, phones } })
                }}
                placeholder="+53 XXX XXX XXXX"
                className="admin-form-input"
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
          <div className="admin-page-header" style={{ marginBottom: "1rem" }}>
            <label className="admin-form-label" style={{ margin: 0 }}>
              WhatsApps
            </label>
            <button type="button" onClick={addWhatsApp} className="admin-btn admin-btn-success admin-btn-sm">
              ➕ Agregar
            </button>
          </div>
          {(data.contact?.whatsapps || []).map((whatsapp, index) => (
            <div key={index} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => {
                  const whatsapps = [...(data.contact?.whatsapps || [])]
                  whatsapps[index] = e.target.value
                  setData({ ...data, contact: { ...data.contact!, whatsapps } })
                }}
                placeholder="+53 XXX XXX XXXX"
                className="admin-form-input"
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

        <div className="admin-form-grid">
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
        <div className="admin-page-header">
          <h2 className="admin-card-title" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
            🗺️ Distribución Nacional
          </h2>
          <button type="button" onClick={addCity} className="admin-btn admin-btn-success admin-btn-sm">
            ➕ Agregar Ciudad
          </button>
        </div>

        <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
          {(data.nationalDelivery?.cities || []).map((city, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr)) auto",
                gap: "1rem",
                alignItems: "end",
              }}
            >
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
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
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? "⏳ Guardando..." : "💾 Guardar Configuración"}
        </button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}


