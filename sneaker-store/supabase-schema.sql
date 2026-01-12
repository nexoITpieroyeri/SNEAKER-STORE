-- ============================================
-- SNEAKER STORE - BASE DE DATOS SUPABASE
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: brands (Marcas)
-- ============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar marcas por defecto
INSERT INTO brands (name, slug) VALUES
('Nike', 'nike'),
('Adidas', 'adidas'),
('Jordan', 'jordan'),
('Yeezy', 'yeezy'),
('New Balance', 'new_balance'),
('Puma', 'puma')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- TABLA: products (Productos)
-- ============================================
CREATE TYPE product_status AS ENUM ('draft', 'published', 'sold_out', 'archived');
CREATE TYPE product_gender AS ENUM ('men', 'women', 'unisex', 'kids');
CREATE TYPE product_category AS ENUM ('running', 'basketball', 'casual', 'lifestyle', 'limited_edition');
CREATE TYPE product_condition AS ENUM ('new_with_box', 'new_without_box', 'preowned');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  final_price DECIMAL(10, 2),
  gender product_gender DEFAULT 'unisex',
  category product_category DEFAULT 'casual',
  condition product_condition DEFAULT 'new_with_box',
  status product_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  sku TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actualizar final_price después de insert/update
CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.final_price = COALESCE(
    NEW.base_price * (1 - COALESCE(NEW.discount_percentage, 0) / 100),
    NEW.base_price
  );
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_final_price
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION calculate_final_price();

-- Índices para products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_final_price ON products(final_price);

-- ============================================
-- TABLA: product_images (Imágenes)
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(product_id, display_order);

-- ============================================
-- TABLA: product_sizes (Tallas)
-- ============================================
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);

-- ============================================
-- TABLA: admin_users (Administradores)
-- ============================================
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor');

CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role admin_role DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: site_settings (Configuraciones)
-- ============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO site_settings (key, value) VALUES
('whatsapp_number', '{"number": "521234567890", "country_code": "52"}'),
('business_name', '{"es": "Sneaker Store", "en": "Sneaker Store"}'),
('contact_email', '{"email": "contacto@sneakerstore.com"}'),
('instagram_handle', '{"handle": "sneakerstore"}'),
('featured_products', '{"ids": []}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- TABLA: analytics_events (Eventos)
-- ============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_product ON analytics_events(product_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

-- ============================================
-- TABLA: product_views (Vistas de productos)
-- ============================================
CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip INET,
  user_agent TEXT
);

CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_time ON product_views(viewed_at);

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
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

-- Policies para brands (público lectura)
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

-- Policies para products (público lectura de publicados)
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies para product_images
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies para product_sizes
CREATE POLICY "Product sizes are viewable by everyone" ON product_sizes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product sizes" ON product_sizes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies para admin_users
CREATE POLICY "Users can view their own admin profile" ON admin_users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND role = 'super_admin'
    )
  );

-- Policies para site_settings
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies para analytics_events (solo insert público)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies para product_views (solo insert público)
CREATE POLICY "Anyone can insert product views" ON product_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view product views" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ============================================
-- VISTAS PARA EL ADMIN
-- ============================================

-- Vista para productos activos
CREATE OR REPLACE VIEW active_products AS
SELECT 
  p.*,
  b.name as brand_name,
  b.slug as brand_slug
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.status = 'published';

-- Vista para dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM products WHERE status = 'published') as total_products,
  (SELECT COUNT(*) FROM products WHERE status = 'draft') as draft_products,
  (SELECT COUNT(*) FROM products WHERE status = 'sold_out') as sold_out_products,
  (SELECT SUM(view_count) FROM products) as total_views,
  (SELECT SUM(whatsapp_clicks) FROM products) as total_whatsapp_clicks;

-- Vista para productos con stock bajo
CREATE OR REPLACE VIEW low_stock_products AS
SELECT p.id, p.name, p.slug, ps.size, ps.stock_quantity
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
WHERE ps.stock_quantity < 3
ORDER BY ps.stock_quantity ASC;

-- ============================================
-- DATOS DE EJEMPLO (PRODUCTOS)
-- ============================================
INSERT INTO products (name, slug, description, base_price, discount_percentage, gender, category, condition, status, sku) VALUES
('Nike Dunk Low "Panda"', 'nike-dunk-low-panda', 'Las icónicas Dunk Low en colorway Panda. Combinación de negro y blanco que va con todo.', 2500, 0, 'unisex', 'casual', 'new_with_box', 'published', 'DD1391-100'),
('Air Jordan 1 High OG "Chicago"', 'air-jordan-1-high-og-chicago', 'El clásico que empezó todo. Colorway Chicago auténtico.', 3200, 10, 'men', 'basketball', 'new_with_box', 'published', '555088-101'),
('Adidas Yeezy Boost 350 "Zebra"', 'adidas-yeezy-boost-350-zebra', 'La clásica Zebra con el característico stripe translúcido.', 4500, 0, 'unisex', 'running', 'new_with_box', 'published', 'CP9654')
ON CONFLICT DO NOTHING;

-- Insertar imágenes para productos
INSERT INTO product_images (product_id, image_url, display_order)
SELECT p.id, 
  CASE p.slug
    WHEN 'nike-dunk-low-panda' THEN 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800'
    WHEN 'air-jordan-1-high-og-chicago' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
    WHEN 'adidas-yeezy-boost-350-zebra' THEN 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
  END,
  0
FROM products p WHERE p.slug IN ('nike-dunk-low-panda', 'air-jordan-1-high-og-chicago', 'adidas-yeezy-boost-350-zebra')
ON CONFLICT DO NOTHING;

-- Insertar tallas
INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT p.id, size, quantity
FROM products p,
  (VALUES 
    ('nike-dunk-low-panda', ARRAY['US 8', 'US 9', 'US 10'], ARRAY[2, 1, 3]),
    ('air-jordan-1-high-og-chicago', ARRAY['US 8.5', 'US 9'], ARRAY[1, 2]),
    ('adidas-yeezy-boost-350-zebra', ARRAY['US 10', 'US 11'], ARRAY[2, 1])
  ) AS t(product_slug, sizes, quantities)
CROSS JOIN UNNEST(sizes, quantities) AS size_data(size, quantity)
WHERE p.slug = t.product_slug
ON CONFLICT DO NOTHING;
