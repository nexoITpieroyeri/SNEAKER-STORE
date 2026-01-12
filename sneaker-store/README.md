# 🏃 SNEAKER STORE

E-commerce de zapatillas auténticas con venta conversacional por WhatsApp.

## ✨ Características

- **Catálogo de productos** con filtros por marca, género y precio
- **Detalle de producto** con galería de imágenes y selector de talla
- **Favoritos** guardados en localStorage
- **WhatsApp integration** con mensaje pre-cargado
- **Diseño responsive** con Tailwind CSS
- **Panel Admin** (básico)

## 🛠️ Tech Stack

- **React 19** + Vite
- **Tailwind CSS** + shadcn/ui components
- **React Router** para navegación
- **Zustand** para estado (favoritos)
- **Supabase** como backend (PostgreSQL)
- **Framer Motion** para animaciones

## 🚀 Getting Started

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Ejecutar servidor de desarrollo
npm run dev
```

### Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Copiar las credenciales del proyecto en `.env`
3. Ejecutar el script SQL en `supabase-schema.sql` en el Editor SQL de Supabase

## 📁 Estructura

```
src/
├── components/
│   ├── ui/          # Componentes base (Button, Card, Input)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── HomeSections.jsx
├── pages/
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── ProductDetail.jsx
│   └── Favorites.jsx
├── store/
│   └── favoritesStore.js
├── lib/
│   ├── supabase.js
│   ├── config.js
│   └── utils.js
└── types/
    ├── constants.js
    └── index.js
```

## 🎯 Flujo de Usuario

1. Cliente explora el catálogo
2. Ve detalles del producto
3. Selecciona talla
4. Click en "Consultar por WhatsApp"
5. Se abre WhatsApp con mensaje pre-cargado
6. Negociación y cierre de venta por WhatsApp

## 📱 WhatsApp Integration

El botón de WhatsApp genera un link con el producto y talla seleccionados:

```
https://wa.me/NÚMERO?text=Mensaje+pre-cargado
```

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- Políticas de acceso por rol
- Solo admins pueden modificar productos

## 📄 Licencia

MIT
