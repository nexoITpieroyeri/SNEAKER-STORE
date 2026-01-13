-- Script SQL para analytics
-- Ejecutar esto en Supabase SQL Editor

-- 1. Agregar constraint único (si no existe)
DO $$ BEGIN
  ALTER TABLE analytics ADD CONSTRAINT analytics_date_unique UNIQUE (date);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Insertar datos de los últimos 30 días
INSERT INTO analytics (date, visits, whatsapp_queries) VALUES
('2026-01-13', 45, 8),
('2026-01-12', 52, 12),
('2026-01-11', 38, 5),
('2026-01-10', 61, 15),
('2026-01-09', 55, 10),
('2026-01-08', 48, 9),
('2026-01-07', 42, 7),
('2026-01-06', 35, 4),
('2026-01-05', 67, 18),
('2026-01-04', 72, 22),
('2026-01-03', 58, 14),
('2026-01-02', 49, 11),
('2026-01-01', 85, 25),
('2025-12-31', 95, 28),
('2025-12-30', 78, 20),
('2025-12-29', 65, 16),
('2025-12-28', 55, 12),
('2025-12-27', 48, 9),
('2025-12-26', 52, 11),
('2025-12-25', 88, 24),
('2025-12-24', 92, 26),
('2025-12-23', 76, 19),
('2025-12-22', 68, 17),
('2025-12-21', 62, 14),
('2025-12-20', 55, 11),
('2025-12-19', 58, 13),
('2025-12-18', 45, 8),
('2025-12-17', 52, 10),
('2025-12-16', 48, 9),
('2025-12-15', 61, 15)
ON CONFLICT (date) DO UPDATE SET
  visits = EXCLUDED.visits,
  whatsapp_queries = EXCLUDED.whatsapp_queries;

-- 3. Verificar datos
SELECT
  TO_CHAR(date, 'YYYY-MM-DD') as date,
  visits,
  whatsapp_queries,
  ROUND((whatsapp_queries::numeric / NULLIF(visits, 0) * 100), 1) as conversion_rate
FROM analytics
ORDER BY date DESC
LIMIT 10;
