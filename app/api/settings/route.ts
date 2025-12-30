import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await prisma.catalogSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    })
    return NextResponse.json({
      contact: settings.contact,
      localDelivery: settings.localDelivery,
      nationalDelivery: settings.nationalDelivery,
      companyName: settings.companyName,
      companyTagline: settings.companyTagline,
      catalogIntro: settings.catalogIntro,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    await prisma.catalogSettings.upsert({
      where: { id: 1 },
      update: {
        ...(body.contact ? { contact: body.contact } : {}),
        ...(body.localDelivery ? { localDelivery: body.localDelivery } : {}),
        ...(body.nationalDelivery ? { nationalDelivery: body.nationalDelivery } : {}),
        ...(body.companyName ? { companyName: body.companyName } : {}),
        ...(body.companyTagline ? { companyTagline: body.companyTagline } : {}),
        ...(body.catalogIntro ? { catalogIntro: body.catalogIntro } : {}),
      },
      create: {
        id: 1,
        contact: body.contact ?? { phones: [], whatsapps: [] },
        localDelivery: body.localDelivery ?? {
          capacity: 'Hasta 3 Pallets por envío',
          priceRange: 'Desde 4.000 hasta 8.000 MNs según zona de entrega',
        },
        nationalDelivery: body.nationalDelivery ?? { cities: [] },
        companyName: body.companyName ?? 'Luna',
        companyTagline: body.companyTagline ?? 'Su socio estratégico en distribución comercial',
        catalogIntro: body.catalogIntro ?? '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
}
