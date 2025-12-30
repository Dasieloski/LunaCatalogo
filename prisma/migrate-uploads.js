/* eslint-disable no-console */
require('dotenv').config()
/**
 * Migrates local files from public/uploads to Supabase Storage and updates Product.image to the public URL.
 *
 * Requirements:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - SUPABASE_STORAGE_BUCKET (default "uploads")
 * - DATABASE_URL
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('Missing SUPABASE_URL')
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function main() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads'
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    console.log('No public/uploads folder. Nothing to migrate.')
    return
  }

  const supabase = getSupabase()

  const products = await prisma.product.findMany()
  let updatedCount = 0

  for (const p of products) {
    if (!p.image) continue
    if (/^https?:\/\//i.test(p.image)) continue
    if (!p.image.startsWith('/uploads/')) continue

    const filename = p.image.replace('/uploads/', '')
    const localPath = path.join(uploadsDir, filename)
    if (!fs.existsSync(localPath)) continue

    const buffer = fs.readFileSync(localPath)
    const objectPath = filename

    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      upsert: true,
      contentType: 'application/octet-stream',
    })

    if (error) {
      console.error('Upload error for', filename, error)
      continue
    }

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath)
    if (!publicUrl?.publicUrl) continue

    await prisma.product.update({
      where: { id: p.id },
      data: { image: publicUrl.publicUrl },
    })
    updatedCount++
  }

  console.log(`Migration OK. Updated ${updatedCount} product image URLs.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


