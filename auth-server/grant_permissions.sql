-- Grant Permissions for admin User to Create Tables
-- Run this SQL in pgAdmin to allow the `admin` user to create tables in the `wendells_recipe` database.
-- Steps:
-- 1. In pgAdmin, right-click the `wendells_recipe` database → Query Tool
-- 2. Copy and paste the SQL below
-- 3. Click Execute (or press F5)
-- 4. Close the query tool and restart the auth server

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO admin;

-- Grant all table privileges on public schema
GRANT CREATE ON SCHEMA public TO admin;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;

-- Grant select/insert/update/delete on existing tables (if any)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;

-- Grant usage on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO admin;
