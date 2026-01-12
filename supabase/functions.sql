-- =====================================================
-- SNEAKER STORE - SQL SCRIPT COMPLETO
-- =====================================================

-- ----------------------------------------------------------------
-- FUNCIONES SQL
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION increment_view_count(product_id UUID)
RETURNS void AS '
BEGIN
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
' LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(product_id UUID)
RETURNS void AS '
BEGIN
  UPDATE products
  SET whatsapp_clicks = whatsapp_clicks + 1
  WHERE id = product_id;
END;
' LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------
-- TABLA: RESERVACIONES
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage reservations" ON reservations;
CREATE POLICY "Admins can manage reservations" ON reservations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- ----------------------------------------------------------------
-- TABLA: NEWSLETTER
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public subscriptions" ON newsletter_subscribers;
CREATE POLICY "Allow public subscriptions" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- ----------------------------------------------------------------
-- ÍNDICES
-- ----------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_reservations_product_id ON reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
