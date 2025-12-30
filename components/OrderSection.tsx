'use client'

import { ContactInfo } from '@/lib/types'

interface OrderSectionProps {
  contact: ContactInfo
}

export default function OrderSection({ contact }: OrderSectionProps) {
  return (
    <section className="order-section">
      <div className="order-container">
        <div className="order-header">
          <div className="section-banner">
            <h2 className="order-title">Solicite su Cotización</h2>
          </div>
          <p className="order-subtitle">Nuestro equipo comercial está a su disposición para brindarle atención personalizada y asesoría especializada</p>
        </div>
        <div className="contact-cards">
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3 className="contact-card-title">Líneas Telefónicas</h3>
            {contact.phones.map((phone, index) => (
              <p key={index} className="contact-card-info">{phone}</p>
            ))}
            <p className="contact-card-hours">Horario de Atención: Lunes a Viernes de 8:00 AM a 6:00 PM</p>
          </div>
          <div className="contact-card highlight">
            <div className="contact-icon">💬</div>
            <h3 className="contact-card-title">WhatsApp Business</h3>
            {contact.whatsapps.map((whatsapp, index) => (
              <p key={index} className="contact-card-info">{whatsapp}</p>
            ))}
            <p className="contact-card-hours">Atención Inmediata las 24 horas del día, los 7 días de la semana</p>
          </div>
        </div>
        <div className="order-cta">
          <p className="cta-text">Comprometidos con la excelencia en el servicio y la satisfacción de nuestros clientes</p>
        </div>
      </div>
    </section>
  )
}
