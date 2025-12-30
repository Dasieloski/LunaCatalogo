import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        presentation: body.presentation,
        image: body.image,
        priceContainer: body.priceContainer,
        pricePallet: body.pricePallet,
        priceBox: body.priceBox,
        status: body.status,
      },
    })

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? '',
      category: updated.category ?? '',
      presentation: updated.presentation,
      image: updated.image ?? '',
      priceContainer: updated.priceContainer,
      pricePallet: updated.pricePallet,
      priceBox: updated.priceBox,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (error) {
    // Prisma: record not found
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
