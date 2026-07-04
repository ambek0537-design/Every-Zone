-- Create database extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Logging initialization
SELECT 'Database initialized with core extensions successfully' AS status;
