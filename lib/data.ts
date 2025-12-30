import { prisma } from '@/lib/prisma'
import type { CatalogData, ContactInfo, LocalDelivery, NationalDelivery, Product } from './types'

function safeJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback
  return value as T
}

export async function getCatalogData(): Promise<CatalogData> {
  const [settings, products] = await Promise.all([
    prisma.catalogSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    }),
    prisma.product.findMany({ orderBy: { updatedAt: 'desc' } }),
  ])

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      category: p.category ?? '',
      presentation: p.presentation,
      image: p.image ?? '',
      priceContainer: p.priceContainer,
      pricePallet: p.pricePallet,
      priceBox: p.priceBox,
      status: (p.status as Product['status']) ?? 'active',
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    contact: safeJson<ContactInfo>(settings.contact, { phones: [], whatsapps: [] }),
    localDelivery: safeJson<LocalDelivery>(settings.localDelivery, {
      capacity: 'Hasta 3 Pallets por envío',
      priceRange: 'Desde 4.000 hasta 8.000 MNs según zona de entrega',
    }),
    nationalDelivery: safeJson<NationalDelivery>(settings.nationalDelivery, { cities: [] }),
    companyName: settings.companyName,
    companyTagline: settings.companyTagline,
    catalogIntro: settings.catalogIntro,
  }
}

export async function saveCatalogData(data: CatalogData): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.catalogSettings.upsert({
      where: { id: 1 },
      update: {
        companyName: data.companyName,
        companyTagline: data.companyTagline,
        catalogIntro: data.catalogIntro,
        contact: data.contact as unknown as object,
        localDelivery: data.localDelivery as unknown as object,
        nationalDelivery: data.nationalDelivery as unknown as object,
      },
      create: {
        id: 1,
        companyName: data.companyName,
        companyTagline: data.companyTagline,
        catalogIntro: data.catalogIntro,
        contact: data.contact as unknown as object,
        localDelivery: data.localDelivery as unknown as object,
        nationalDelivery: data.nationalDelivery as unknown as object,
      },
    })
  })
}
