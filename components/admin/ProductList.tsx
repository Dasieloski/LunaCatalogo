'use client'

import { Product } from '@/lib/types'
import Image from 'next/image'

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-state-icon">📦</div>
        <p>No hay productos. Crea tu primer producto.</p>
      </div>
    )
  }

  return (
    <div className="admin-product-list">
      {products.map((product) => (
        <div key={product.id} className="admin-product-item">
          <div>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={120}
                height={120}
                className="admin-product-image"
                unoptimized
              />
            ) : (
              <div className="admin-product-image-placeholder">Sin imagen</div>
            )}
          </div>

          <div className="admin-product-info">
            <h3>
              {product.name}
              {product.status === 'offer' && (
                <span className="admin-product-badge">OFERTA</span>
              )}
            </h3>
            <p className="admin-product-details">
              <strong>Presentación:</strong> {product.presentation}
            </p>
            {product.category && (
              <p className="admin-product-details">
                <strong>Categoría:</strong> {product.category}
              </p>
            )}
            <div className="admin-product-prices">
              <span className="admin-product-price-item">
                <strong>Contenedor:</strong> {product.priceContainer}
              </span>
              <span className="admin-product-price-item">
                <strong>Pallet:</strong> {product.pricePallet}
              </span>
              <span className="admin-product-price-item">
                <strong>Caja:</strong> {product.priceBox}
              </span>
            </div>
          </div>

          <div className="admin-product-actions">
            <button
              onClick={() => onEdit(product)}
              className="admin-btn admin-btn-sm admin-btn-primary"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="admin-btn admin-btn-sm admin-btn-danger"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
