import { NextRequest, NextResponse } from 'next/server'
import { cookies } from "next/headers"
import { getSupabaseAdminClient } from '@/lib/supabase-server'
import { getAdminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-session"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Require admin session (upload uses service role key)
    const token = cookies().get(getAdminSessionCookieName())?.value
    const ok = await verifyAdminSessionToken(token)
    if (!ok) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

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

    // Validate bucket exists (common source of 500s)
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    if (bucketListError) {
      console.error("Supabase listBuckets error:", bucketListError)
      return NextResponse.json(
        { error: `No se pudo validar buckets: ${bucketListError.message}` },
        { status: 500 },
      )
    }
    const bucketExists = (buckets || []).some((b) => b.name === bucket)
    if (!bucketExists) {
      return NextResponse.json(
        { error: `El bucket '${bucket}' no existe en Supabase. Crea el bucket o ajusta SUPABASE_STORAGE_BUCKET.` },
        { status: 500 },
      )
    }

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
      return NextResponse.json(
        { error: `Supabase upload error: ${uploadError.message}` },
        { status: 500 },
      )
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
