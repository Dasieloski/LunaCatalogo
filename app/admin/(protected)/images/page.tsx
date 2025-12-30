"use client"

import { useEffect, useMemo, useState } from "react"

type ImageItem = {
  name: string
  path: string
  publicUrl: string
  created_at?: string | null
  updated_at?: string | null
  bucket: string
}

export default function AdminImagesPage() {
  const [items, setItems] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [query, setQuery] = useState("")
  const [deleting, setDeleting] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((x) => x.name.toLowerCase().includes(q) || x.path.toLowerCase().includes(q))
  }, [items, query])

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/images?limit=200")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "No se pudieron cargar las imágenes")
      }
      const data = await res.json()
      setItems(data.items || [])
    } catch (e: any) {
      setError(e?.message || "Error al cargar imágenes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copiado ✅")
    } catch {
      prompt("Copia este link:", text)
    }
  }

  const remove = async (item: ImageItem) => {
    if (!confirm(`¿Eliminar imagen?\n\n${item.path}`)) return
    setDeleting((p) => ({ ...p, [item.path]: true }))
    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: item.path, bucket: item.bucket }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Error al eliminar")
      setItems((prev) => prev.filter((x) => x.path !== item.path))
    } catch (e: any) {
      alert(e?.message || "Error al eliminar")
    } finally {
      setDeleting((p) => ({ ...p, [item.path]: false }))
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">🖼️ Imágenes</h1>

      <div className="admin-card">
        <h2 className="admin-card-title">📁 Bucket público (Supabase)</h2>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="admin-form-input"
            placeholder="Buscar por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: "1 1 260px" }}
          />
          <button className="admin-btn admin-btn-secondary" onClick={load} disabled={loading}>
            {loading ? "⏳ Cargando..." : "🔄 Recargar"}
          </button>
        </div>

        {error ? <div className="admin-alert admin-alert-error" style={{ marginTop: "1rem" }}>❌ {error}</div> : null}
        <p style={{ marginTop: "1rem", color: "#475569", fontWeight: 600 }}>
          Tip: aquí puedes copiar el URL público y pegarlo en productos, o eliminar imágenes viejas.
        </p>
      </div>

      {loading ? (
        <div className="admin-card">
          <p className="admin-card-title">⏳ Cargando imágenes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">🖼️</div>
          <p>No hay imágenes (o no coinciden con el filtro).</p>
        </div>
      ) : (
        <div className="admin-image-grid">
          {filtered.map((it) => (
            <div key={it.path} className="admin-image-card">
              <div className="admin-image-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.publicUrl} alt={it.name} />
              </div>
              <div className="admin-image-meta">
                <div className="admin-image-name" title={it.path}>
                  {it.name}
                </div>
                <div className="admin-image-actions">
                  <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => copy(it.publicUrl)}>
                    🔗 Copiar URL
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => remove(it)}
                    disabled={!!deleting[it.path]}
                  >
                    {deleting[it.path] ? "⏳" : "🗑️"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


