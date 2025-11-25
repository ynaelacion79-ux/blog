/*
  init_db.js
  Helper to create Postgres role and database for the auth server when `psql` is not available.

  Usage (PowerShell):
    $env:PG_SUPERUSER='postgres'; $env:PG_SUPERPASS='supersecret'; node init_db.js

  Or set these env vars in a .env file or pass through your shell.

  Required env variables (defaults shown):
    PG_HOST (default: localhost)
    PG_PORT (default: 5432)
    PG_SUPERUSER (no default)
    PG_SUPERPASS (no default)
    NEW_DB (default: wendells_recipe)
    NEW_USER (default: admin)
    NEW_PASS (default: adminpassword)
*/

require('dotenv').config();
const { Client } = require('pg');

const host = process.env.PG_HOST || 'localhost';
const port = parseInt(process.env.PG_PORT || '5432', 10);
const superUser = process.env.PG_SUPERUSER;
const superPass = process.env.PG_SUPERPASS;
const newDb = process.env.NEW_DB || process.env.DB_NAME || 'wendells_recipe';
const newUser = process.env.NEW_USER || process.env.DB_USER || 'admin';
const newPass = process.env.NEW_PASS || process.env.DB_PASSWORD || 'adminpassword';

if (!superUser || !superPass) {
  console.error('ERROR: PG_SUPERUSER and PG_SUPERPASS must be provided as env vars.');
  process.exit(1);
}

async function run() {
  const client = new Client({
    host,
    port,
    user: superUser,
    password: superPass,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log(`Connected to Postgres as ${superUser} at ${host}:${port}`);

    // Create role if not exists
    const createRoleSql = `DO $$\nBEGIN\n  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = $1) THEN\n    EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', $1, $2);\n  END IF;\nEND$$;`;
    await client.query(createRoleSql, [newUser, newPass]);
    console.log(`Role '${newUser}' ensured.`);

    // Create database if not exists
    const checkDb = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [newDb]);
    if (checkDb.rowCount === 0) {
      await client.query(`CREATE DATABASE ${newDb} OWNER ${newUser}`);
      console.log(`Database '${newDb}' created and owned by '${newUser}'.`);
    } else {
      console.log(`Database '${newDb}' already exists.`);
      // ensure owner and privileges
      await client.query(`ALTER DATABASE ${newDb} OWNER TO ${newUser}`);
      console.log(`Database '${newDb}' owner set to '${newUser}'.`);
    }

    // Grant privileges
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${newDb} TO ${newUser}`);
    console.log(`Granted privileges on '${newDb}' to '${newUser}'.`);

    console.log('Done. You can now start the auth server (ensure auth-server/.env matches these credentials).');
  } catch (err) {
    console.error('Error while initializing DB:', err.message || err);
    process.exitCode = 2;
  } finally {
    try { await client.end(); } catch(e){}
  }
}

run();
