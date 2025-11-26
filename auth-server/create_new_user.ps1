# PowerShell script to create a new PostgreSQL user and database

# Configuration
$PG_USER = "postgres"  # Default PostgreSQL admin user
$DB_USER = "recipe_user"
$DB_PASSWORD = "recipe123"
$DB_NAME = "wendells_recipe"

# Prompt for PostgreSQL admin password
$PG_PASSWORD = Read-Host "Enter your PostgreSQL 'postgres' user password" -AsSecureString
$PG_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($PG_PASSWORD))

# Create SQL commands
$sql = @"
-- Create new user if not exists
DO
`$do`$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
`$do`$;

-- Grant privileges
ALTER USER $DB_USER CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

SELECT 'User creation complete!' as status;
"@

# Run psql command
Write-Host "Creating PostgreSQL user '$DB_USER'..."
$sql | psql -U $PG_USER -h localhost -p 5432 -d postgres

Write-Host ""
Write-Host "User created successfully!"
Write-Host "Username: $DB_USER"
Write-Host "Password: $DB_PASSWORD"
Write-Host "Database: $DB_NAME"
