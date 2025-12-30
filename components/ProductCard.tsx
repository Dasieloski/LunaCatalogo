'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.image || '/uploads/placeholder.jpg'
  // Precio principal (en el diseño de referencia se ve como etiqueta amarilla)
  const mainPrice = product.priceBox || product.pricePallet || product.priceContainer
  const title = `${product.name} ${product.presentation ?? ''}`.trim()

  return (
    <article className="product-card">
      <div className="product-media">
        <div className="product-image-container">
          <Image
            src={imageSrc}
            alt={title}
            width={260}
            height={260}
            className="product-image"
            unoptimized
          />
        </div>
        <div className="product-price-banner" aria-label="Precio principal">
          <span className="price-main">{mainPrice}</span>
        </div>
      </div>

      <h3 className="product-name">{title}</h3>

      <div className="product-details">
        <p className="product-line">
          <span className="product-line-label">Unidad:</span>{' '}
          <span className="product-line-value">{product.priceContainer}</span>
        </p>
        <p className="product-line">
          <span className="product-line-label">Caja:</span>{' '}
          <span className="product-line-value">{product.priceBox}</span>
        </p>
        <p className="product-line">
          <span className="product-line-label">Pallet:</span>{' '}
          <span className="product-line-value">{product.pricePallet}</span>
        </p>
      </div>
    </article>
  )
}
