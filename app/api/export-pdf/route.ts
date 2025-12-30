import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const baseUrl = searchParams.get('baseUrl') || 'http://localhost:3000'
    const catalogUrl = `${baseUrl}/catalog`
    
    // Vercel sometimes lacks shared libs (e.g. libnss3.so) needed to launch Chromium.
    // Best-practice fallback is a remote Chrome (Browserless) via WebSocket.
    const browserlessWs =
      process.env.BROWSERLESS_WS_ENDPOINT ||
      process.env.BROWSER_WS_ENDPOINT ||
      ""
    const browserlessToken = process.env.BROWSERLESS_TOKEN || ""

    const isVercel = !!process.env.VERCEL
    const browser = await (async () => {
      if (isVercel && browserlessWs) {
        const puppeteerCore = await import("puppeteer-core")
        const pptr = (puppeteerCore as any).default ?? puppeteerCore

        let ws = browserlessWs
        if (browserlessToken && !ws.includes("token=")) {
          ws += (ws.includes("?") ? "&" : "?") + `token=${encodeURIComponent(browserlessToken)}`
        }

        return pptr.connect({
          browserWSEndpoint: ws,
        })
      }

      // Otherwise try local launch (works locally, may work on some Vercel runtimes).
      if (isVercel) {
        const puppeteerCore = await import("puppeteer-core")
        const chromiumMod = await import("@sparticuz/chromium")
        const chromium = (chromiumMod as any).default ?? chromiumMod
        const pptr = (puppeteerCore as any).default ?? puppeteerCore

        return pptr.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: "new",
        })
      }

      const puppeteerMod = await import("puppeteer")
      const pptr = (puppeteerMod as any).default ?? puppeteerMod
      return pptr.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      })
    })()
    
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
    
    // When using browserless connect(), close() is fine; it closes the remote session.
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
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al generar PDF",
        hint:
          process.env.VERCEL
            ? "En Vercel, configura BROWSERLESS_WS_ENDPOINT (y opcionalmente BROWSERLESS_TOKEN) para generar el PDF sin depender de librerías del sistema."
            : undefined,
      },
      { status: 500 }
    )
  }
}
