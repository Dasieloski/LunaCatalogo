/* eslint-disable no-console */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.join(process.cwd(), 'data', 'catalog.json')
  if (!fs.existsSync(dataPath)) {
    console.log('No data/catalog.json found, skipping seed.')
    return
  }

  const raw = fs.readFileSync(dataPath, 'utf8')
  const catalog = JSON.parse(raw)

  await prisma.catalogSettings.upsert({
    where: { id: 1 },
    update: {
      companyName: catalog.companyName || 'Luna',
      companyTagline: catalog.companyTagline || '',
      catalogIntro: catalog.catalogIntro || '',
      contact: catalog.contact || { phones: [], whatsapps: [] },
      localDelivery: catalog.localDelivery || {},
      nationalDelivery: catalog.nationalDelivery || { cities: [] },
    },
    create: {
      id: 1,
      companyName: catalog.companyName || 'Luna',
      companyTagline: catalog.companyTagline || '',
      catalogIntro: catalog.catalogIntro || '',
      contact: catalog.contact || { phones: [], whatsapps: [] },
      localDelivery: catalog.localDelivery || {},
      nationalDelivery: catalog.nationalDelivery || { cities: [] },
    },
  })

  const products = Array.isArray(catalog.products) ? catalog.products : []

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: String(p.id) },
      update: {
        name: p.name,
        description: p.description || '',
        category: p.category || '',
        presentation: p.presentation,
        image: p.image || '',
        priceContainer: p.priceContainer,
        pricePallet: p.pricePallet,
        priceBox: p.priceBox,
        status: p.status || 'active',
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      },
      create: {
        id: String(p.id),
        name: p.name,
        description: p.description || '',
        category: p.category || '',
        presentation: p.presentation,
        image: p.image || '',
        priceContainer: p.priceContainer,
        pricePallet: p.pricePallet,
        priceBox: p.priceBox,
        status: p.status || 'active',
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      },
    })
  }

  console.log(`Seed OK. Settings + ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


