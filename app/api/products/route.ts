import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { updatedAt: 'desc' } })
    return NextResponse.json(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? '',
        category: p.category ?? '',
        presentation: p.presentation,
        image: p.image ?? '',
        priceContainer: p.priceContainer,
        pricePallet: p.pricePallet,
        priceBox: p.priceBox,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const created = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category || '',
        presentation: body.presentation,
        image: body.image || '',
        priceContainer: body.priceContainer,
        pricePallet: body.pricePallet,
        priceBox: body.priceBox,
        status: body.status || 'active',
      },
    })

    return NextResponse.json(
      {
        id: created.id,
        name: created.name,
        description: created.description ?? '',
        category: created.category ?? '',
        presentation: created.presentation,
        image: created.image ?? '',
        priceContainer: created.priceContainer,
        pricePallet: created.pricePallet,
        priceBox: created.priceBox,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
