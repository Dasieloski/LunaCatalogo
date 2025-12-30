'use client'

import { LocalDelivery, NationalDelivery } from '@/lib/types'

interface DeliverySectionProps {
  localDelivery: LocalDelivery
  nationalDelivery: NationalDelivery
}

export default function DeliverySection({ localDelivery, nationalDelivery }: DeliverySectionProps) {
  return (
    <>
      {/* Mensajería en La Habana */}
      <section className="delivery-section local-delivery">
        <div className="delivery-container">
          <div className="delivery-header">
            <div className="section-banner">
              <h2 className="delivery-title">Servicio de Mensajería en La Habana</h2>
            </div>
            <p className="delivery-subtitle">Le acercamos sus compras directamente a su punto de venta en La Habana</p>
          </div>
          <div className="delivery-info">
            <div className="delivery-specs">
              <div className="spec-item">
                <div className="spec-icon">📦</div>
                <strong>Capacidad de Transporte</strong>
                <p>{localDelivery.capacity}</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">💰</div>
                <strong>Tarifas Competitivas</strong>
                <p>{localDelivery.priceRange}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mensajería desde La Habana */}
      <section className="delivery-section national-delivery">
        <div className="delivery-container">
          <div className="delivery-header">
            <div className="section-banner">
              <h2 className="delivery-title">Distribución Nacional desde La Habana</h2>
            </div>
            <p className="delivery-subtitle">Cobertura a nivel nacional. Llevamos sus productos a todas las provincias de Cuba</p>
          </div>
          <div className="delivery-info">
            <div className="delivery-locations">
              <h3 className="locations-title">Provincias y Ciudades con Cobertura</h3>
              <div className="locations-grid">
                {nationalDelivery.cities.map((city, index) => (
                  <div key={index} className="location-item">
                    <strong>{city.name}</strong>
                    <span>{city.province}</span>
                  </div>
                ))}
              </div>
              <p className="locations-note">
                Consulte disponibilidad y tarifas específicas para su destino. Nuestro equipo de logística le brindará un presupuesto personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
