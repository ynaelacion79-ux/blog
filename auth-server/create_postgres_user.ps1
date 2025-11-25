# Run this PowerShell script to create a Postgres user and database for the auth server.
# Requires `psql` in PATH or run from "SQL Shell (psql)" that comes with Postgres.
# Edit the variables below as needed, then run in PowerShell (may prompt for postgres password):

$superUser = 'postgres'        # Postgres superuser (default installer user)
$newUser = 'admin'             # the DB user the server will use
$newPassword = 'adminpassword' # the password for $newUser
$dbName = 'wendells_recipe'    # database name

Write-Host "Creating user '$newUser' and database '$dbName' (you may be prompted for the postgres password)..."

# Create user
psql -U $superUser -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$newUser') THEN CREATE ROLE $newUser WITH LOGIN PASSWORD '$newPassword'; END IF; END $$;"

# Create DB owned by new user
psql -U $superUser -c "CREATE DATABASE $dbName OWNER $newUser;" 2>$null

# Grant privileges
psql -U $superUser -c "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $newUser;"

Write-Host "Done. Update auth-server/.env DB_USER and DB_PASSWORD if different, then start the server."
