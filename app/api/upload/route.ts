import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = getSupabaseAdminClient()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'fotos'

    // Generar nombre único
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^\w.\-]+/g, '_')
    const objectPath = `${timestamp}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
    }

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath)

    return NextResponse.json({
      success: true,
      filename: publicUrl.publicUrl,
      path: objectPath,
      bucket,
    })
  } catch (error) {
    console.error('Error al subir archivo:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir archivo' },
      { status: 500 }
    )
  }
}
