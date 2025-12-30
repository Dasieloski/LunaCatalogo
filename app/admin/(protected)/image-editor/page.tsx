"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

export default function ImageEditorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [priceContainer, setPriceContainer] = useState("")
  const [pricePallet, setPricePallet] = useState("")
  const [priceBox, setPriceBox] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [available, setAvailable] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [catalogData, setCatalogData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setCatalogData(data)
        if (data.contact?.whatsapps?.length > 0) {
          setWhatsapp(data.contact.whatsapps.join("\n"))
        }
      })
      .catch(console.error)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const drawImage = () => {
    if (!uploadedImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const canvasSize = 1200
    canvas.width = canvasSize
    canvas.height = canvasSize

    const backgroundColor = "#e0e7ff"
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const scaleX = canvasSize / img.width
      const scaleY = canvasSize / img.height
      let scale = Math.min(scaleX, scaleY)

      if (img.height > img.width) {
        scale = scale * 0.9
      }

      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const imgX = (canvasSize - scaledWidth) / 2
      const imgY = (canvasSize - scaledHeight) / 2

      ctx.save()
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, imgX, imgY, scaledWidth, scaledHeight)
      ctx.restore()

      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      if (productName) {
        ctx.fillStyle = "#0f172a"
        const leftX = canvasSize * 0.15
        const topY = canvasSize * 0.08
        const nameFontSize = Math.floor(canvasSize * 0.035)
        ctx.font = `800 ${nameFontSize}px 'Space Grotesk', sans-serif`
        ctx.fillText(productName, leftX, topY)
      }

      const priceFontSize = Math.floor(canvasSize * 0.018)
      ctx.font = `600 ${priceFontSize}px 'Space Grotesk', sans-serif`
      ctx.fillStyle = "#0f172a"
      ctx.textAlign = "center"

      let priceY = canvasSize * 0.15
      const leftX = canvasSize * 0.15

      if (priceContainer) {
        ctx.fillText(`Contenedor-${priceContainer} CUP`, leftX, priceY)
        priceY += priceFontSize * 1.5
      }
      if (pricePallet) {
        ctx.fillText(`Pallet-${pricePallet} CUP`, leftX, priceY)
        priceY += priceFontSize * 1.5
      }
      if (priceBox) {
        ctx.fillText(`Caja-${priceBox} CUP`, leftX, priceY)
        priceY += priceFontSize * 1.5
      }

      if (available) {
        ctx.fillStyle = "#166534"
        const availableFontSize = Math.floor(canvasSize * 0.018)
        ctx.font = `700 ${availableFontSize}px 'Space Grotesk', sans-serif`
        ctx.textAlign = "center"
        ctx.fillText("Disponible hoy", leftX, priceY)
      }

      if (whatsapp) {
        ctx.fillStyle = "#25D366"
        const whatsappFontSize = Math.floor(canvasSize * 0.014)
        ctx.font = `600 ${whatsappFontSize}px 'Space Grotesk', sans-serif`
        ctx.textAlign = "left"
        const whatsappLines = whatsapp.split("\n").filter((line) => line.trim())
        const whatsappLeftX = canvasSize * 0.05
        let whatsappY = canvasSize * 0.88

        whatsappLines.forEach((line) => {
          ctx.fillText(`📱 ${line.trim()}`, whatsappLeftX, whatsappY)
          whatsappY += whatsappFontSize * 1.8
        })
      }

      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.onload = () => {
        const logoSize = canvasSize * 0.18
        const padding = canvasSize * 0.03
        const logoX = canvasSize - logoSize - padding
        const logoY = canvasSize - logoSize - padding
        const bgPadding = canvasSize * 0.01

        ctx.fillStyle = "#e0e7ff"
        ctx.fillRect(logoX - bgPadding, logoY - bgPadding, logoSize + bgPadding * 2, logoSize + bgPadding * 2)

        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
      }
      logoImg.src = "/LUNA.png"
    }
    img.src = uploadedImage
  }

  useEffect(() => {
    if (uploadedImage) {
      const timeoutId = setTimeout(() => {
        drawImage()
      }, 150)

      return () => clearTimeout(timeoutId)
    }
  }, [uploadedImage, productName, priceContainer, pricePallet, priceBox, whatsapp, available])

  const downloadImage = () => {
    if (!canvasRef.current) return

    drawImage()

    setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const link = document.createElement("a")
      const fileName = productName ? `${productName.toLowerCase().replace(/\\s+/g, "-")}-luna.png` : "producto-luna.png"
      link.download = fileName
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    }, 500)
  }

  return (
    <div>
      <h1 className="admin-page-title">🖼️ Editor de Imágenes</h1>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 420px) 1fr", gap: "1.5rem" }}>
        <div className="admin-card" style={{ position: "sticky", top: "96px", height: "fit-content" }}>
          <h2 className="admin-card-title">📝 Información del Producto</h2>

          <div className="admin-form-group">
            <label className="admin-form-label">Subir Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="admin-form-input" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Nombre del Producto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: Spaguetti"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Precio Contenedor (CUP)</label>
            <input
              type="text"
              value={priceContainer}
              onChange={(e) => setPriceContainer(e.target.value)}
              placeholder="220"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Precio Pallet (CUP)</label>
            <input
              type="text"
              value={pricePallet}
              onChange={(e) => setPricePallet(e.target.value)}
              placeholder="220"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Precio Caja (CUP)</label>
            <input
              type="text"
              value={priceBox}
              onChange={(e) => setPriceBox(e.target.value)}
              placeholder="230"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp (uno por línea)</label>
            <textarea
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder={"+34 659314125\n+53 58320990"}
              rows={4}
              className="admin-form-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-checkbox">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              <span style={{ fontWeight: 800, textTransform: "uppercase" }}>Disponible Hoy</span>
            </label>
          </div>

          <button
            onClick={downloadImage}
            disabled={!uploadedImage}
            className={`admin-btn admin-auth-submit ${uploadedImage ? "admin-btn-primary" : "admin-btn-secondary"}`}
          >
            {uploadedImage ? "⬇️ Descargar Imagen" : "📷 Sube una imagen primero"}
          </button>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">👁️ Vista Previa</h2>
          {uploadedImage ? (
            <div style={{ border: "4px solid #0f172a", background: "#e0e7ff", padding: "1rem", boxShadow: "4px 4px 0px #1e40af" }}>
              <canvas ref={canvasRef} style={{ width: "100%", height: "auto", maxWidth: 600, margin: "0 auto", display: "block", aspectRatio: "1 / 1" }} />
            </div>
          ) : (
            <div style={{ border: "4px dashed #1e40af", background: "#eff6ff", padding: "4rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📷</div>
              <p style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sube una imagen
              </p>
              <p style={{ color: "#64748b", marginTop: "0.5rem", fontWeight: 600 }}>
                La imagen se actualizará automáticamente mientras editas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


