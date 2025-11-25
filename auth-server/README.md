# Wendell's Recipe — Auth Server

This is a minimal Node.js + Express authentication backend using SQLite, bcrypt, and JWT. No Docker required.

Quick start

1. Open a terminal in `auth-server`:

```powershell
cd 'C:\Users\boot\Desktop\blog\auth-server'
```

2. Install dependencies:

```powershell
npm install
```

3. Copy the example env file:

```powershell
copy .env.example .env
```

4. Start the server:

```powershell
npm start
```

The server will listen on `http://localhost:4000`. A SQLite database (`auth.sqlite`) will be created automatically in the `auth-server` folder.

API

- POST /api/register
  - Body: `{ name?, email, password }`
  - Response: `{ user, token }`

- POST /api/login
  - Body: `{ email, password }`
  - Response: `{ user, token }`

- GET /api/me
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

Example register request:

```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'
```

Example login request:

```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

Notes

- For production, use a strong JWT secret, HTTPS, and secure password storage.
- JWT tokens expire after 7 days.
- The SQLite database is stored locally and persists between restarts.

