import { NextResponse } from 'next/server'
import { getCatalogData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getCatalogData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener datos del catálogo' },
      { status: 500 }
    )
  }
}
