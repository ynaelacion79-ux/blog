const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const PORT = process.env.PORT || 5200;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Serve static files from parent directory (HTML, CSS, images)
app.use(express.static('../'));

// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'recipe_blog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

pool.on('error', (err) => console.error('Unexpected error on idle client', err));

// Initialize database tables
async function initDB() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table ready');

    // Create login_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        email VARCHAR(255),
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(255),
        user_agent TEXT
      );
    `);
    console.log('✓ Login history table ready');

    // Create ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        recipe_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Ratings table ready');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  }
}

initDB();

// Helper functions
function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ===== ENDPOINTS =====

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email.toLowerCase(), password_hash]
    );

    const user = result.rows[0];
    const token = createToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('[auth] Login attempt for:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log('[auth] Login failed — user not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log('[auth] Login failed — wrong password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);
    console.log('[auth] Login successful for:', email, 'userId=', user.id);

    // Record login in history (async, non-blocking)
    (async () => {
      try {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const ua = req.headers['user-agent'] || 'unknown';
        await pool.query(
          'INSERT INTO login_history (user_id, email, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
          [user.id, user.email, ip, ua]
        );
      } catch (e) {
        console.error('Failed to record login history:', e);
      }
    })();

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user (protected)
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get /api/me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save recipe rating (protected)
app.post('/api/ratings', authMiddleware, async (req, res) => {
  const { recipe_name, rating } = req.body;

  if (!recipe_name || !rating) {
    return res.status(400).json({ error: 'Recipe name and rating required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO ratings (user_id, recipe_name, rating) VALUES ($1, $2, $3) RETURNING id, user_id, recipe_name, rating, created_at',
      [req.user.id, recipe_name, rating]
    );

    res.status(201).json({ rating: result.rows[0] });
  } catch (err) {
    console.error('Save rating error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get ratings for a recipe
app.get('/api/ratings/:recipe_name', async (req, res) => {
  const { recipe_name } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, user_id, recipe_name, rating, created_at FROM ratings WHERE recipe_name = $1 ORDER BY created_at DESC',
      [recipe_name]
    );

    const ratings = result.rows;
    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({ recipe_name, ratings, averageRating: avgRating, totalRatings: ratings.length });
  } catch (err) {
    console.error('Get ratings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all login history (for admin/monitoring)
app.get('/api/login-history', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, email, login_time, ip_address FROM login_history ORDER BY login_time DESC LIMIT 100'
    );

    res.json({ loginHistory: result.rows });
  } catch (err) {
    console.error('Get login history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DEBUG: list users (development only)
app.get('/api/debug-users', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Not allowed' });
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 200');
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Debug users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../index.html');
});

// Serve login.html for /login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../login.html');
});

// Catch-all: serve index.html for any unknown routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/../index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Recipe blog backend running on http://localhost:${PORT}`);
  console.log(`  - Register: POST /api/register`);
  console.log(`  - Login: POST /api/login`);
  console.log(`  - Get User: GET /api/me (requires auth)`);
  console.log(`  - Save Rating: POST /api/ratings (requires auth)`);
  console.log(`  - Get Ratings: GET /api/ratings/:recipe_name\n`);
});
