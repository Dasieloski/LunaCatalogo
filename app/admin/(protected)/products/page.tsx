"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import ProductForm from "@/components/admin/ProductForm"
import ProductList from "@/components/admin/ProductList"
import { ToastContainer } from "@/components/admin/Toast"
import type { ToastType } from "@/components/admin/Toast"

interface Toast {
  id: string
  message: string
  type: ToastType
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      addToast("Error al cargar productos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    loadProducts()
    setShowForm(false)
    setEditingProduct(null)
    addToast(editingProduct ? "Producto actualizado exitosamente" : "Producto creado exitosamente", "success")
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este producto?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadProducts()
        addToast("Producto eliminado exitosamente", "success")
      } else {
        addToast("Error al eliminar producto", "error")
      }
    } catch (error) {
      addToast("Error al eliminar producto", "error")
    }
  }

  if (loading) {
    return (
      <div className="admin-card">
        <p className="admin-card-title">⏳ Cargando productos...</p>
      </div>
    )
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📦 Productos</h1>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="admin-btn admin-btn-primary"
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}


