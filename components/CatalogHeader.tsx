'use client'

import Image from 'next/image'
import { CatalogData } from '@/lib/types'

interface CatalogHeaderProps {
  data: CatalogData
}

export default function CatalogHeader({ data }: CatalogHeaderProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentYear = new Date().getFullYear()
  const yearDigits = currentYear.toString().split('')

  return (
    <>
      <header className="header catalog-cover">
        <div className="cover-shapes">
          <div className="shape shape-top-left"></div>
          <div className="shape shape-top-right"></div>
          <div className="shape shape-bottom-left"></div>
          <div className="shape shape-bottom-right"></div>
        </div>
        <div className="logo-background">
          <Image
            src="/LUNA.png"
            alt="Logo Luna"
            width={900}
            height={900}
            className="logo-translucent"
            priority
          />
        </div>
        <div className="header-content">
          <div className="catalog-title-container">
            <h1 className="catalog-title">CATÁLOGO</h1>
            <div className="year-container">
              <span className="year-digit year-20">{yearDigits[0]}{yearDigits[1]}</span>
              <span className="year-digit year-25">{yearDigits[2]}{yearDigits[3]}</span>
            </div>
          </div>
          <p className="catalog-tagline">Todo lo que necesitas en un solo lugar</p>
          <div className="catalog-date-section">
            <p className="current-date-text">Fecha: {currentDate}</p>
          </div>
        </div>
      </header>
    </>
  )
}
