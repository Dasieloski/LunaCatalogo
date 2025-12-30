import { getCatalogData } from '@/lib/data'
import CatalogHeader from '@/components/CatalogHeader'
import ProductCard from '@/components/ProductCard'
import DeliverySection from '@/components/DeliverySection'
import OrderSection from '@/components/OrderSection'
import Footer from '@/components/Footer'

export default async function CatalogPage() {
  const data = await getCatalogData()
  const activeProducts = data.products.filter(p => p.status === 'active' || p.status === 'offer' || p.status === 'featured')

  return (
    <>
      <CatalogHeader data={data} />
      
      <main className="main-content">
        <div className="products-section-header">
          <h2 className="section-title">PRODUCTOS DE ALTA ROTACIÓN</h2>
        </div>
        
        <div className="products-grid">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <DeliverySection 
        localDelivery={data.localDelivery}
        nationalDelivery={data.nationalDelivery}
      />

      <OrderSection contact={data.contact} />

      <Footer />
    </>
  )
}
