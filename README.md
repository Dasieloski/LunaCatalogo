# Catálogo Luna - Sistema de Gestión

Sistema completo de gestión de catálogo de productos con panel de administración y exportación a PDF.

## Características

- ✅ Panel de administración intuitivo
- ✅ Gestión completa de productos (CRUD)
- ✅ Subida y gestión de imágenes
- ✅ Gestión de información de contacto
- ✅ Configuración de servicios de mensajería
- ✅ Exportación automática a PDF
- ✅ Previsualización antes de exportar
- ✅ Diseño responsive

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── catalog/           # Vista del catálogo
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
├── lib/                   # Utilidades y helpers
├── data/                  # Datos (JSON)
├── public/                # Archivos estáticos
│   ├── LUNA.png          # Logo
│   └── uploads/          # Imágenes subidas
└── styles/               # Estilos CSS
```

## Despliegue en Vercel con Supabase (persistencia real)

En Vercel el disco es **efímero**: lo que se suba a `public/uploads` se pierde al redeploy/restart.  
Para que al volver a entrar al sitio sigan las **fotos + precios + productos**, el proyecto usa:

- **Supabase Postgres** (datos)
- **Supabase Storage** (imágenes)
- **Prisma** (ORM)

### 1) Crear proyecto en Supabase

1. Crea un proyecto en Supabase.
2. En **Storage**, crea un bucket (recomendado: `uploads`) y márcalo como **Public**.
3. Copia:
   - **SUPABASE_URL** y **Service Role Key** (Project Settings → API)
   - **DATABASE_URL** (Project Settings → Database → Connection string)

### 2) Variables de entorno (local y Vercel)

Configura estas variables:

- **SUPABASE_URL**
- **SUPABASE_SERVICE_ROLE_KEY** (solo servidor)
- **SUPABASE_STORAGE_BUCKET** (por defecto `uploads`)
- **DATABASE_URL**

### 3) Crear tablas con Prisma

Con `DATABASE_URL` configurada:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4) Importar datos actuales (opcional)

Si ya tienes `data/catalog.json`, puedes importar settings y productos:

```bash
npm run db:seed
```

> Nota: si tus imágenes antiguas están en `public/uploads`, en Vercel **no** serán persistentes.
> Debes re-subirlas al bucket (o migrarlas).

## Uso

1. Accede al panel de administración en `/admin`
2. Gestiona productos, contactos y servicios
3. Previsualiza el catálogo en `/catalog`
4. Exporta a PDF desde el panel de administración

## PDF en Vercel (IMPORTANTE)

En algunos runtimes serverless de Vercel, **Chromium no puede arrancar** por librerías del sistema faltantes (ej. `libnss3.so`).  
Eso **no se puede arreglar instalando paquetes del sistema** en Vercel.

### Solución recomendada (funciona siempre): Chrome remoto (Browserless)

1. Crea una cuenta en Browserless (o un proveedor de Chrome remoto compatible).
2. Copia tu **WebSocket endpoint** (wss://...).
3. En Vercel → Project → Settings → Environment Variables agrega:
   - **BROWSERLESS_WS_ENDPOINT**: ejemplo `wss://chrome.browserless.io?token=TU_TOKEN`
   - (Opcional) **BROWSERLESS_TOKEN**: si tu endpoint NO incluye `token=...`
4. Redeploy.

El endpoint `/api/export-pdf` intentará lanzar Chromium localmente; si falla por librerías faltantes, se conectará al Chrome remoto.

## Credenciales por defecto

Usuario: `admin`
Contraseña: `admin123`

**⚠️ IMPORTANTE: Cambia estas credenciales en producción**
