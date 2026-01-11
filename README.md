# Sneaker Store - E-Commerce de Zapatillas

Catálogo digital de zapatillas auténticas con integración WhatsApp para ventas conversacionales.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel
- **State Management:** React Query, Zustand
- **Validación:** Zod

## 📁 Estructura del Proyecto

```
sneaker-store/
├── app/
│   ├── admin/           # Panel administrativo
│   ├── api/             # API routes
│   ├── auth/            # Autenticación
│   ├── catalogo/        # Catálogo de productos
│   ├── producto/        # Detalle de producto
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── admin/           # Componentes del admin
│   ├── hooks/           # Custom hooks
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── actions/         # Server Actions
│   ├── hooks/           # React Query hooks
│   ├── supabase/        # Configuración Supabase
│   └── utils/           # Utilidades
├── supabase/
│   ├── schema.sql       # Schema de la base de datos
│   └── rls-policies.sql # Políticas RLS
└── public/              # Archivos estáticos
```

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd sneaker-store
```

2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

4. Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=5219999999999
```

5. Configurar la base de datos:
   - Crear proyecto en Supabase
   - Ejecutar `supabase/schema.sql` en el SQL Editor
   - Ejecutar `supabase/rls-policies.sql` para las políticas de seguridad
   - Crear bucket 'product-images' en Storage

6. Configurar el bucket de Storage:
   - Ir a Supabase → Storage → New Bucket
   - Nombre: `product-images`
   - Hacer público el bucket

7. Crear usuario admin:
   - Registrarse en la aplicación
   - Insertar el usuario en la tabla `admin_users` con rol correspondiente

8. Ejecutar en desarrollo:
```bash
npm run dev
```

## 📦 Scripts

```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Construir para producción
npm run start      # Iniciar servidor de producción
npm run lint       # Ejecutar linter
```

## 🔐 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo server) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp Business |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación |

## 🗄️ Base de Datos

### Tablas Principales

- **brands:** Catálogo de marcas
- **products:** Productos principales
- **product_images:** Imágenes por producto
- **product_sizes:** Tallas y stock
- **admin_users:** Usuarios administradores
- **site_settings:** Configuraciones del sitio
- **analytics_events:** Eventos de analytics
- **product_views:** Historial de vistas

### Roles de Admin

- **super_admin:** Acceso total
- **admin:** Gestión de productos y contenido
- **editor:** Crear y editar productos

## 🔄 Server Actions

```typescript
// Crear producto
createProduct(data: ProductInput): Promise<ActionResult>

// Actualizar producto
updateProduct(id: string, data: ProductInput): Promise<ActionResult>

// Eliminar producto
deleteProduct(id: string): Promise<ActionResult>

// Gestión de marcas
createBrand(data: BrandInput): Promise<ActionResult>
updateBrand(id: string, data: BrandInput): Promise<ActionResult>
deleteBrand(id: string): Promise<ActionResult>
```

## 📱 Integración WhatsApp

El botón de WhatsApp genera un link con mensaje pre-cargado:

```typescript
generateWhatsAppLink(product, size, phoneNumber)
// Resultado: https://wa.me/521999...?text=👟%20Nike%20Air%20Max...
```

## 🎨 Personalización

### Colores
Editar `tailwind.config.ts` para personalizar colores.

### Componentes UI
Los componentes shadcn/ui están en `/components/ui/`.

### Meta Tags
Editable en `app/layout.tsx` para SEO global.

## 📊 Analytics

El sistema rastrea:
- Vistas de productos
- Clics en WhatsApp
- Productos más vistos
- Usuarios únicos por IP

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Manual

```bash
npm run build
npm run start
```

## 📄 Licencia

MIT License -自由 usar y modificar.

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request
