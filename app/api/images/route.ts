import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { getAdminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-session"

export const dynamic = "force-dynamic"

async function requireAdminAuth() {
  const token = cookies().get(getAdminSessionCookieName())?.value
  const ok = await verifyAdminSessionToken(token)
  return ok
}

export async function GET(req: NextRequest) {
  try {
    const ok = await requireAdminAuth()
    if (!ok) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const prefix = searchParams.get("prefix") || ""
    const limit = Math.min(Number(searchParams.get("limit") || 100) || 100, 200)
    const offset = Math.max(Number(searchParams.get("offset") || 0) || 0, 0)

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "fotos"
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      console.error("Supabase list error:", error)
      return NextResponse.json({ error: "Error al listar imágenes" }, { status: 500 })
    }

    const items =
      (data || [])
        .filter((x) => x.name && !x.name.endsWith("/"))
        .map((x) => {
          const path = prefix ? `${prefix.replace(/\/+$/g, "")}/${x.name}` : x.name
          const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
          return {
            name: x.name,
            id: x.id,
            created_at: x.created_at,
            updated_at: x.updated_at,
            last_accessed_at: x.last_accessed_at,
            metadata: x.metadata,
            path,
            publicUrl: publicUrl.publicUrl,
            bucket,
          }
        }) || []

    return NextResponse.json({ items, bucket, prefix, limit, offset })
  } catch (err) {
    console.error("Error /api/images GET:", err)
    return NextResponse.json({ error: "Error al listar imágenes" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ok = await requireAdminAuth()
    if (!ok) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const path = body?.path as string | undefined
    const bucket = (body?.bucket as string | undefined) || process.env.SUPABASE_STORAGE_BUCKET || "fotos"

    if (!path) return NextResponse.json({ error: "Falta 'path'" }, { status: 400 })

    const supabase = getSupabaseAdminClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Supabase remove error:", error)
      return NextResponse.json({ error: "Error al eliminar imagen" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error /api/images DELETE:", err)
    return NextResponse.json({ error: "Error al eliminar imagen" }, { status: 500 })
  }
}


