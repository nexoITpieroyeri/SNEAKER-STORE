-- ==========================================
-- POLÍTICAS RLS ADICIONALES
-- Ejecutar este archivo después del schema principal
-- ==========================================

-- ==========================================
-- site_settings: Permitir INSERT/UPDATE
-- ==========================================

-- Eliminar políticas existentes si hay conflicto
DROP POLICY IF EXISTS "Admin can update settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON site_settings;

-- Crear políticas para usuarios autenticados
CREATE POLICY "Admin can update settings" ON site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert settings" ON site_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- Verificación
-- ==========================================
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'site_settings';
