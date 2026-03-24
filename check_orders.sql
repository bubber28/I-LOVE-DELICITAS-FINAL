-- Verificar estrutura da tabela orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Se faltar algum campo, execute:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_code TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS preparing_at TIMESTAMP;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivering_at TIMESTAMP;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'awaiting';
