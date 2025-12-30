'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    presentation: '',
    priceContainer: '',
    pricePallet: '',
    priceBox: '',
    status: 'active' as Product['status'],
    image: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        presentation: product.presentation,
        priceContainer: product.priceContainer,
        pricePallet: product.pricePallet,
        priceBox: product.priceBox,
        status: product.status,
        image: product.image || '',
      })
    }
  }, [product])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.filename }))
      }
    } catch (error) {
      alert('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
      } else {
        alert('Error al guardar producto')
      }
    } catch (error) {
      alert('Error al guardar producto')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="admin-card-title">
        {product ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label className="admin-form-label">Nombre *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Categoría</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="admin-form-textarea"
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Presentación *</label>
        <input
          type="text"
          value={formData.presentation}
          onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
          required
          placeholder="Ej: 500 g, 750 ml"
          className="admin-form-input"
        />
      </div>

      <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-form-group">
          <label className="admin-form-label">Precio Contenedor *</label>
          <input
            type="text"
            value={formData.priceContainer}
            onChange={(e) => setFormData({ ...formData, priceContainer: e.target.value })}
            required
            placeholder="Ej: 190 MNs"
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Precio Pallet *</label>
          <input
            type="text"
            value={formData.pricePallet}
            onChange={(e) => setFormData({ ...formData, pricePallet: e.target.value })}
            required
            placeholder="Ej: 190 MNs"
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Precio Caja *</label>
          <input
            type="text"
            value={formData.priceBox}
            onChange={(e) => setFormData({ ...formData, priceBox: e.target.value })}
            required
            placeholder="Ej: 200 MNs"
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label className="admin-form-label">Estado</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
            className="admin-form-select"
          >
            <option value="active">Activo</option>
            <option value="offer">En Oferta</option>
            <option value="featured">Destacado</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="admin-form-input"
          />
          {uploading && <p style={{ marginTop: '0.5rem', color: '#4299e1', fontSize: '0.9rem' }}>⏳ Subiendo...</p>}
          {formData.image && !uploading && (
            <p style={{ marginTop: '0.5rem', color: '#48bb78', fontSize: '0.9rem', fontWeight: 600 }}>
              ✓ Imagen: {formData.image}
            </p>
          )}
        </div>
      </div>

      {formData.image && (
        <div className="admin-form-group">
          <label className="admin-form-label">Vista Previa</label>
          <img
            src={formData.image}
            alt="Preview"
            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={onCancel}
          className="admin-btn admin-btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
        >
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  )
}
