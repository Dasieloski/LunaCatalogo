import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const baseUrl = searchParams.get('baseUrl') || 'http://localhost:3000'
    const catalogUrl = `${baseUrl}/catalog`
    
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })
    
    const page = await browser.newPage()
    
    // Configurar viewport para A4
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    })
    
    // Navegar a la página y esperar a que todo cargue
    await page.goto(catalogUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000,
    })
    
    // Esperar a que las imágenes se carguen completamente
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = resolve // Continuar aunque falle una imagen
            setTimeout(resolve, 2000) // Timeout de seguridad
          })
        })
      )
    })
    
    // Esperar un poco más para que los estilos se apliquen
    await page.waitForTimeout(1000)
    
    // Inyectar CSS adicional para asegurar el layout correcto
    await page.addStyleTag({
      content: `
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* IMPORTANTE:
             Evitamos overrides grandes aquí para que el PDF siga el mismo diseño
             que styles/globals.css. Solo forzamos saltos de página y evitamos
             cortes feos. */
          .header.catalog-cover {
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          .main-content {
            page-break-before: always !important;
          }
          .product-card,
          .product-media,
          .product-image-container,
          .product-price-banner,
          .delivery-section,
          .order-section,
          .footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `
    })
    
    // Generar PDF con configuración optimizada para A4
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
      displayHeaderFooter: false,
      scale: 1,
    })
    
    await browser.close()

    const dateStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    
    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="catalogo-luna-${dateStr}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error al generar PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    )
  }
}
