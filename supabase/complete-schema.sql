-- ============================================
-- SNEAKER STORE - DATABASE SCHEMA COMPLETO
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Brands (Marcas)
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products (Productos)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  final_price DECIMAL(10, 2) NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
  category TEXT NOT NULL CHECK (category IN ('running', 'basketball', 'casual', 'lifestyle', 'limited_edition')),
  condition TEXT NOT NULL CHECK (condition IN ('new_with_box', 'new_without_box', 'preowned')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold_out', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  sku TEXT,
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images (Imágenes)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Sizes (Tallas y Stock)
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED
);

-- Admin Users (Administradores)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Site Settings (Configuraciones)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events (Eventos de Analytics)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Views (Vistas de Productos)
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip TEXT
);

-- Contact Messages (Mensajes de Contacto)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers (Suscritos al Newsletter)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Discount Codes (Códigos de Descuento)
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  percentage DECIMAL(5, 2) NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  min_purchase DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations (Apartados)
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_final_price ON products(final_price);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_is_available ON product_sizes(product_id, is_available) WHERE is_available = true;

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_id ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_is_active ON discount_codes(is_active);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations(expires_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA brands
-- ============================================

-- Lectura pública
CREATE POLICY "Public read access for brands" ON brands
  FOR SELECT USING (true);

-- Escritura solo para admins
CREATE POLICY "Enable insert for brands by admin" ON brands
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable update for brands by admin" ON brands
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable delete for brands by super_admin" ON brands
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- ============================================
-- POLÍTICAS PARA products
-- ============================================

-- Lectura pública solo para publicados
CREATE POLICY "Public read access for published products" ON products
  FOR SELECT USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Escritura para admins y editores
CREATE POLICY "Enable insert for products by admin" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Enable update for products by admin" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Solo super_admin y admin pueden eliminar
CREATE POLICY "Enable delete for products by admin" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- POLÍTICAS PARA product_images
-- ============================================

CREATE POLICY "Public read access for images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for images by admin" ON product_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Enable update for images by admin" ON product_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Enable delete for images by admin" ON product_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- ============================================
-- POLÍTICAS PARA product_sizes
-- ============================================

CREATE POLICY "Public read access for sizes" ON product_sizes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for sizes by admin" ON product_sizes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Enable update for sizes by admin" ON product_sizes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Enable delete for sizes by admin" ON product_sizes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- ============================================
-- POLÍTICAS PARA admin_users
-- ============================================

CREATE POLICY "Admin users can read their own data" ON admin_users
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users a2
      WHERE a2.id = auth.uid()
      AND a2.role IN ('super_admin', 'admin')
    )
  );

-- Solo super_admin puede modificar admins
CREATE POLICY "Enable insert for super_admin" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Enable update for super_admin" ON admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- ============================================
-- POLÍTICAS PARA site_settings
-- ============================================

CREATE POLICY "Enable read access for settings by admin" ON site_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable update for settings by admin" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable insert for super_admin" ON site_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- ============================================
-- POLÍTICAS PARA analytics_events
-- ============================================

CREATE POLICY "Enable read access for analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable insert for analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA product_views
-- ============================================

CREATE POLICY "Enable read access for views" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Enable insert for views" ON product_views
  FOR INSERT WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA contact_messages
-- ============================================

CREATE POLICY "Public can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- POLÍTICAS PARA newsletter_subscribers
-- ============================================

CREATE POLICY "Public can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read subscribers" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- POLÍTICAS PARA discount_codes
-- ============================================

CREATE POLICY "Public can validate discount codes" ON discount_codes
  FOR SELECT USING (
    is_active = true AND
    valid_from <= NOW() AND
    valid_until >= NOW() AND
    (usage_limit IS NULL OR used_count < usage_limit)
  );

CREATE POLICY "Admins can manage discount codes" ON discount_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- POLÍTICAS PARA reservations
-- ============================================

CREATE POLICY "Public can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage reservations" ON reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar configuraciones por defecto
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '"5219999999999"'),
  ('business_name', '"Sneaker Store"'),
  ('contact_email', '"info@sneakerstore.com"'),
  ('instagram_handle', '"@sneakerstore"'),
  ('facebook_handle', '"@sneakerstore"'),
  ('featured_products', '[]'),
  ('home_banner_title', '"Zapatillas Auténticas al Mejor Precio"'),
  ('home_banner_subtitle', '"Encuentra los modelos más exclusivos de Nike, Adidas, Jordan y más"'),
  ('about_text', '"Somos tu tienda de confianza para zapatillas originales. Encuentra los mejores modelos con atención personalizada."'),
  ('shipping_info', '"Envíos a toda la República Mexicana. 2-5 días hábiles."'),
  ('return_policy', '"5 días para cambios y devoluciones en productos sin uso."')
ON CONFLICT (key) DO NOTHING;

-- Insertar marcas
INSERT INTO brands (name, slug, logo_url) VALUES
  ('Nike', 'nike', NULL),
  ('Adidas', 'adidas', NULL),
  ('Jordan', 'jordan', NULL),
  ('Yeezy', 'yeezy', NULL),
  ('New Balance', 'new-balance', NULL),
  ('Puma', 'puma', NULL),
  ('Converse', 'converse', NULL),
  ('Vans', 'vans', NULL),
  ('Reebok', 'reebok', NULL),
  ('Asics', 'asics', NULL),
  ('Under Armour', 'under-armour', NULL),
  ('Balenciaga', 'balenciaga', NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- EJEMPLO DE PRODUCTOS (para testing)
-- ============================================

-- INSERT INTO products (brand_id, name, slug, description, base_price, gender, category, condition, status, featured, sku)
-- SELECT 
--   id, 
--   'Nike Air Jordan 1 High OG', 
--   'nike-air-jordan-1-high-og',
--   'Las icónicas Air Jordan 1 High OG en su versión más clássica.',
--   3200,
--   'men',
--   'basketball',
--   'new_with_box',
--   'published',
--   true,
--   'NIKE-AJ1-001'
-- FROM brands WHERE slug = 'jordan'
-- ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para calcular precio final
CREATE OR REPLACE FUNCTION calculate_final_price(base_price DECIMAL, discount_percentage DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF discount_percentage IS NULL OR discount_percentage = 0 THEN
    RETURN base_price;
  END IF;
  RETURN ROUND(base_price * (1 - discount_percentage / 100)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar contador de stock
CREATE OR REPLACE FUNCTION update_stock_availability()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_available = NEW.stock_quantity > 0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_sizes_availability
  BEFORE INSERT OR UPDATE ON product_sizes
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_availability();

-- Función para limpiar reservas expiradas
CREATE OR REPLACE FUNCTION expire_old_reservations()
RETURNS VOID AS $$
BEGIN
  UPDATE reservations
  SET status = 'expired'
  WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLÍTICAS DE STORAGE (Ejecutar en Supabase Storage)
-- ============================================

-- Crear bucket 'product-images' manualmente en Supabase Storage
-- Luego ejecutar estas políticas:

/*
CREATE POLICY "Public read access to product images" ON storage.objects
  FOR SELECT USING ( bucket_id = 'product-images' );

CREATE POLICY "Authenticated upload for admins" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
*/

-- ============================================
-- NOTIFICACIONES EN TIEMPO REAL (Opcional)
-- ============================================

-- Habilitar Realtime para tablas específicas
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;
ALTER PUBLICATION supabase_realtime ADD TABLE product_views;

-- ============================================
-- CONSULTA PARA VERIFICAR RLS
-- ============================================

-- Verificar si RLS está habilitado
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Ver políticas activas
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- USUARIO ADMIN EJEMPLO
-- ============================================

-- 1. Primero crear usuario en Auth (desde la app o Supabase Dashboard)
-- 2. Luego insertar en admin_users:

/*
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth',
  'admin@sneakerstore.com',
  'Administrador Principal',
  'super_admin'
);
*/

-- ============================================
-- NOTA: EJECUTAR ESTE SCRIPT EN ORDEN
-- 1. Crear tablas
-- 2. Crear índices
-- 3. Crear triggers
-- 4. Habilitar RLS
-- 5. Crear políticas
-- 6. Insertar datos iniciales
-- ============================================
