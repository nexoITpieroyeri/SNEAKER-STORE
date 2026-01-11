-- Row Level Security (RLS) Policies for Supabase

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Brands: Public read access
CREATE POLICY "Enable read access for brands" ON brands
  FOR SELECT USING (true);

-- Brands: Only admins can insert/update/delete
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

CREATE POLICY "Enable delete for brands by admin" ON brands
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- Products: Public read access for published products
CREATE POLICY "Enable read access for published products" ON products
  FOR SELECT USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Products: Only admins can insert
CREATE POLICY "Enable insert for products by admin" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Products: Only admins can update
CREATE POLICY "Enable update for products by admin" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Products: Only super_admin and admin can delete
CREATE POLICY "Enable delete for products by admin" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('super_admin', 'admin')
    )
  );

-- Product Images: Read access for all, write access for admins
CREATE POLICY "Enable read access for images" ON product_images
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

-- Product Sizes: Same as images
CREATE POLICY "Enable read access for sizes" ON product_sizes
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

-- Admin Users: Read access for admins, self
CREATE POLICY "Enable read access for admin users" ON admin_users
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users a2
      WHERE a2.id = auth.uid()
      AND a2.role IN ('super_admin', 'admin')
    )
  );

-- Site Settings: Only super_admin can read/write
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

-- Analytics Events: Read access for admins
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

-- Product Views: Read access for admins
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

-- Storage Bucket Policies
-- Create a storage bucket called 'product-images' in Supabase dashboard
-- Then run these policies:

-- Allow public read access to product-images
-- CREATE POLICY "Public read access" ON storage.objects
--   FOR SELECT USING ( bucket_id = 'product-images' );

-- Allow authenticated upload for admins
-- CREATE POLICY "Admin upload" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'product-images' AND
--     EXISTS (
--       SELECT 1 FROM admin_users
--       WHERE admin_users.id = auth.uid()
--       AND admin_users.role IN ('super_admin', 'admin', 'editor')
--     )
--   );

-- Allow admin delete
-- CREATE POLICY "Admin delete" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'product-images' AND
--     EXISTS (
--       SELECT 1 FROM admin_users
--       WHERE admin_users.id = auth.uid()
--       AND admin_users.role IN ('super_admin', 'admin', 'editor')
--     )
--   );
