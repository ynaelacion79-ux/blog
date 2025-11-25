/* Express auth server using SQLite, bcrypt and JWT
   Endpoints:
   - POST /api/register { name, email, password }
   - POST /api/login { email, password }
   - GET  /api/me (Authorization: Bearer <token>)

   Run:
     npm install
     npm start
*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'wendells_recipe',
  user: process.env.DB_USER || 'wendell',
  password: process.env.DB_PASSWORD || 'strongpassword'
});

pool.on('error', (err) => console.error('Unexpected error on idle client', err));

// Initialize users table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
      );
    `);
    console.log('Users table ready');
  } catch (err) {
    console.error('Failed to initialize users table', err);
  }
}

initDB();

function createToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const created_at = Date.now();

    const insertSql = `INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING id, name, email`;
    const result = await pool.query(insertSql, [name || null, email.toLowerCase(), password_hash, created_at]);
    const user = result.rows[0];
    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err && err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    console.error('Register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const query = `SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email.toLowerCase()]);
    const row = result.rows[0];
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: row.id, name: row.name, email: row.email };
    const token = createToken(user);
    res.json({ user, token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected endpoint to get current user
app.get('/api/me', authMiddleware, (req, res) => {
  const id = req.user.id;
  (async () => {
    try {
      const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1', [id]);
      const row = result.rows[0];
      if (!row) return res.status(404).json({ error: 'User not found' });
      res.json({ user: row });
    } catch (err) {
      console.error('Get /api/me error', err);
      res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
