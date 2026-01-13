-- ==========================================
-- SCHEMA COMPLETO SNEAKER STORE
-- Ejecutar TODO este archivo de una vez
-- ==========================================

-- Paso 1: Limpiar todo lo existente
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- ==========================================
-- TABLA: brands (Marcas)
-- ==========================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar marcas
INSERT INTO brands (name, slug) VALUES
('Nike', 'nike'),
('Adidas', 'adidas'),
('Jordan', 'jordan'),
('Yeezy', 'yeezy'),
('New Balance', 'new-balance'),
('Puma', 'puma')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- TABLA: site_settings (Configuración)
-- ==========================================
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT DEFAULT 'Sneaker Store',
    contact_email TEXT,
    whatsapp_number TEXT DEFAULT '521234567890',
    instagram_url TEXT,
    facebook_url TEXT,
    shipping_info TEXT,
    return_policy TEXT,
    about_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (id, site_name, contact_email, whatsapp_number) VALUES
('default', 'Sneaker Store', 'contact@sneakerstore.com', '521234567890')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- TABLA: products (Productos)
-- ==========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    final_price DECIMAL(10,2) GENERATED ALWAYS AS (
        base_price - (base_price * discount_percentage / 100)
    ) STORED,
    gender TEXT DEFAULT 'unisex',
    category TEXT DEFAULT 'casual',
    condition TEXT DEFAULT 'new_with_box',
    sku TEXT UNIQUE,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold_out', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    is_limited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar productos
INSERT INTO products (name, slug, description, base_price, discount_percentage, gender, category, condition, sku, brand_id, status, is_featured)
SELECT 'Nike Dunk Low Panda', 'nike-dunk-low-panda', 'Las icónicas Dunk Low en配色 blanco y negro. Clásico absolute que no puede faltarte.', 2500, 0, 'unisex', 'casual', 'new_with_box', 'DD1391-100', id, 'published', true
FROM brands WHERE slug = 'nike'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, base_price, discount_percentage, gender, category, condition, sku, brand_id, status, is_featured)
SELECT 'Jordan 1 High Chicago', 'jordan-1-high-chicago', 'El clásico que definio el basketball. Colorsway oficial Chicago.', 3200, 10, 'men', 'basketball', 'new_with_box', '555088-101', id, 'published', true
FROM brands WHERE slug = 'jordan'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, base_price, discount_percentage, gender, category, condition, sku, brand_id, status, is_limited)
SELECT 'Yeezy 350 Zebra', 'yeezy-350-zebra', 'La icónica配色 Zebra. Stock limitado, animate ya!', 4500, 0, 'unisex', 'running', 'new_with_box', 'CP9654', id, 'sold_out', true
FROM brands WHERE slug = 'yeezy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, base_price, discount_percentage, gender, category, condition, sku, brand_id, status)
SELECT 'New Balance 550 White Green', 'nb-550-white-green', 'El clásico de los 90 renace. Combinación white green imperdible.', 2800, 10, 'unisex', 'casual', 'new_with_box', 'BB550PWC', id, 'published'
FROM brands WHERE slug = 'new-balance'
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- TABLA: product_images (Imágenes)
-- ==========================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar imagen para Nike Dunk Low Panda
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600', 'Nike Dunk Low Panda', 0, true
FROM products WHERE slug = 'nike-dunk-low-panda';

-- Insertar imagen para Jordan 1 High Chicago
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', 'Jordan 1 High Chicago', 0, true
FROM products WHERE slug = 'jordan-1-high-chicago';

-- Insertar imagen para Yeezy 350 Zebra
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', 'Yeezy 350 Zebra', 0, true
FROM products WHERE slug = 'yeezy-350-zebra';

-- Insertar imagen para NB 550 White Green
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', 'New Balance 550 White Green', 0, true
FROM products WHERE slug = 'nb-550-white-green';

-- ==========================================
-- TABLA: product_sizes (Tallas y stock)
-- ==========================================
CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, size)
);

-- Tallas para Nike Dunk Low Panda
INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 7', 3 FROM products WHERE slug = 'nike-dunk-low-panda'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 8', 5 FROM products WHERE slug = 'nike-dunk-low-panda'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 9', 3 FROM products WHERE slug = 'nike-dunk-low-panda'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 10', 4 FROM products WHERE slug = 'nike-dunk-low-panda'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 11', 2 FROM products WHERE slug = 'nike-dunk-low-panda'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

-- Tallas para Jordan 1 High Chicago
INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 8', 2 FROM products WHERE slug = 'jordan-1-high-chicago'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 9', 2 FROM products WHERE slug = 'jordan-1-high-chicago'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 10', 1 FROM products WHERE slug = 'jordan-1-high-chicago'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

-- Tallas para Yeezy 350 Zebra
INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 8', 0 FROM products WHERE slug = 'yeezy-350-zebra'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 9', 0 FROM products WHERE slug = 'yeezy-350-zebra'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

-- Tallas para NB 550 White Green
INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 8', 3 FROM products WHERE slug = 'nb-550-white-green'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_sizes (product_id, size, stock_quantity)
SELECT id, 'US 9', 2 FROM products WHERE slug = 'nb-550-white-green'
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;

-- ==========================================
-- TABLA: admin_users (Administradores)
-- ==========================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tu usuario admin
INSERT INTO admin_users (id, email, full_name, role) VALUES
('006496c1-d175-45e1-8470-bd8aa59b8e1d', 'cruzadovalladolid@gmail.com', 'Admin Principal', 'super_admin')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- TABLA: analytics (Estadísticas)
-- ==========================================
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    visits INTEGER DEFAULT 0,
    whatsapp_queries INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    source TEXT DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, source)
);

-- Insertar datos de analytics de ejemplo
INSERT INTO analytics (date, visits, whatsapp_queries, page_views, source) VALUES
(CURRENT_DATE - INTERVAL '1 day', 45, 3, 120, 'direct'),
(CURRENT_DATE - INTERVAL '2 days', 38, 5, 98, 'direct'),
(CURRENT_DATE - INTERVAL '3 days', 52, 4, 145, 'direct'),
(CURRENT_DATE - INTERVAL '4 days', 41, 2, 110, 'direct'),
(CURRENT_DATE - INTERVAL '5 days', 35, 6, 95, 'direct'),
(CURRENT_DATE - INTERVAL '6 days', 48, 4, 130, 'direct'),
(CURRENT_DATE - INTERVAL '7 days', 55, 7, 155, 'direct')
ON CONFLICT (date, source) DO NOTHING;

-- ==========================================
-- TABLA: orders (Pedidos)
-- ==========================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    size TEXT,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    source TEXT DEFAULT 'whatsapp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar pedidos de ejemplo
INSERT INTO orders (customer_name, customer_phone, product_name, size, total_amount, status, source) VALUES 
('Juan Pérez', '5215512345678', 'Nike Dunk Low Panda', 'US 9', 2500, 'confirmed', 'whatsapp'),
('María García', '5215598765432', 'Jordan 1 High Chicago', 'US 10', 2900, 'delivered', 'whatsapp'),
('Carlos López', '5215511122233', 'NB 550 White Green', 'US 8', 2500, 'pending', 'whatsapp')
ON CONFLICT DO NOTHING;

-- ==========================================
-- POLÍTICAS RLS (Row Level Security)
-- ==========================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Productos: todos pueden leer publicados/sold_out
CREATE POLICY "Public products read" ON products
    FOR SELECT USING (status = 'published' OR status = 'sold_out');

-- Marcas: todos pueden leer activas
CREATE POLICY "Public brands read" ON brands
    FOR SELECT USING (is_active = true);

-- Imágenes y tallas: lectura pública
CREATE POLICY "Public images read" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public sizes read" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public settings read" ON site_settings FOR SELECT USING (true);

-- Admin users: solo el propio usuario puede ver
CREATE POLICY "Admin users read" ON admin_users FOR SELECT USING (auth.uid() = id);

-- Analytics: solo admins pueden ver
CREATE POLICY "Analytics read" ON analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Orders: solo admins pueden ver
CREATE POLICY "Orders read" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sizes_updated_at 
    BEFORE UPDATE ON product_sizes FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- VERIFICACIÓN
-- ==========================================
SELECT 'Marcas creadas: ' || COUNT(*)::TEXT as status FROM brands;
SELECT 'Productos creados: ' || COUNT(*)::TEXT as status FROM products;
SELECT 'Imágenes creadas: ' || COUNT(*)::TEXT as status FROM product_images;
SELECT 'Tallas creadas: ' || COUNT(*)::TEXT as status FROM product_sizes;
SELECT 'Admins creados: ' || COUNT(*)::TEXT as status FROM admin_users;
SELECT 'Analytics creados: ' || COUNT(*)::TEXT as status FROM analytics;
SELECT 'Pedidos creados: ' || COUNT(*)::TEXT as status FROM orders;
