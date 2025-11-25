# Deploy Frontend + Backend: Step-by-Step

This guide deploys your blog frontend AND Node.js auth server to the web using:
- **Frontend**: Vercel (free, auto-deploys on git push)
- **Backend + Database**: Railway (free Postgres included)

## Prerequisites

Before you start, ensure:
1. ✓ Your auth server runs locally: `npm start` shows `Auth server listening on http://localhost:5100` and `Users table ready`
2. ✓ Your `.env` file exists with correct DB credentials (not committed to git)
3. ✓ You have a GitHub account (create one at https://github.com/join if needed)

---

## Phase 1: Prepare Your Code for Deployment

### Step 1a: Create `.gitignore` (Important!)

This prevents sensitive files from being pushed to GitHub.

In PowerShell:
```powershell
cd C:\Users\boot\Desktop\blog

# Create .gitignore file
@"
# Dependencies
node_modules/
*/node_modules/

# Environment variables (NEVER commit .env)
.env
.env.local
auth-server/.env

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Build outputs
dist/
build/
"@ | Out-File .gitignore -Encoding UTF8

# Verify it was created
Get-Content .gitignore
```

### Step 1b: Ensure `auth-server/.env.example` exists (it does)

This file tells others how to set up `.env`. Users/deployments will copy it and fill in real values.

Verify it has:
```
PORT=5100
JWT_SECRET=your-very-strong-secret
CORS_ORIGIN=http://localhost:8080

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wendells_recipe
DB_USER=admin
DB_PASSWORD=adminpassword
```

---

## Phase 2: Push Your Code to GitHub

### Step 2a: Initialize Git and Commit

```powershell
cd C:\Users\boot\Desktop\blog

# Check if git is already initialized
git status

# If "fatal: not a git repository", run:
git init

# Configure git (do this once globally)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit: Full-stack recipe blog with auth server"

# Verify commit
git log --oneline | head -5
```

### Step 2b: Create a GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `recipe-blog` (or any name you like)
3. **Description**: "Full-stack Filipino recipe blog with authentication"
4. **Visibility**: Public
5. **Initialize**: Leave unchecked (we already have local git)
6. Click **Create repository**

### Step 2c: Push to GitHub

After creating the repo on GitHub, you'll see instructions. Copy the commands:

```powershell
cd C:\Users\boot\Desktop\blog

# Add GitHub as remote (replace USERNAME and REPONAME)
git remote add origin https://github.com/YOUR_USERNAME/recipe-blog.git

# Rename main branch (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main

# When prompted for authentication:
# - Username: your GitHub username
# - Password: use a Personal Access Token (see note below)
```

**If you don't have a Personal Access Token:**
1. Go to GitHub → Settings (top right) → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Name it "Windows Dev"
4. Check `repo` scope
5. Click "Generate token" and **copy it**
6. Use this token as your "password" when git push asks

**Easier: Use GitHub CLI**
```powershell
# Install (if not already)
choco install gh

# Authenticate
gh auth login
# Select "GitHub.com", "HTTPS", "Y" for credentials, then authenticate in browser

# Push
git push -u origin main
```

---

## Phase 3: Deploy Frontend to Vercel

### Step 3a: Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub** and authenticate
3. Authorize Vercel to access your GitHub account

### Step 3b: Import Your Repository

1. After login, click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Find and select `recipe-blog` (your GitHub repo)
4. Click **Import**

### Step 3c: Configure Vercel Project

1. **Project Name**: Keep as `recipe-blog` or change if you like
2. **Framework Preset**: Select **Other** (custom HTML/CSS/JS)
3. **Root Directory**: Leave empty (`.` by default)
4. **Environment Variables**: Leave empty (no backend secrets needed for frontend)
5. Click **Deploy**

Vercel will build and deploy in ~2 minutes. You'll see:
```
✓ Deployment successful!
Preview URL: https://recipe-blog-RANDOM.vercel.app
```

**Your frontend is now live!** 🎉

---

## Phase 4: Deploy Backend to Railway + Postgres

### Step 4a: Sign Up for Railway

1. Go to https://railway.app
2. Click **Start Project**
3. Click **Deploy from GitHub repo** (or continue with GitHub auth)

### Step 4b: Create a New Project

1. Click **New Project**
2. Select your `recipe-blog` GitHub repo
3. Railway detects `package.json` and creates a Node.js service

### Step 4c: Add PostgreSQL Database

1. In the Railway dashboard, click **+ Add**
2. Search for **PostgreSQL** and select it
3. Railway provisions a Postgres instance and auto-adds `DATABASE_URL` env var
4. Click the database tile to see connection details

### Step 4d: Configure Environment Variables

Railway auto-sets `DATABASE_URL`. Add these manually:

1. In Railway dashboard, click your **Node.js service** → **Variables**
2. Add:
   ```
   JWT_SECRET=your-super-secret-random-string-at-least-32-chars
   CORS_ORIGIN=https://recipe-blog-RANDOM.vercel.app
   ```
   (Replace `RANDOM` with your actual Vercel URL from Phase 3)
3. Click **Add** for each

Railway reads `DATABASE_URL` and parses it to set `DB_*` env vars. The server uses:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` from `DATABASE_URL`

(If your `server.js` doesn't parse `DATABASE_URL`, I can update it.)

### Step 4e: Deploy

1. Click **Deploy** or it auto-deploys on git push
2. Wait for build to complete (~2-5 minutes)
3. Once live, Railway shows:
   ```
   Deployment successful
   Live URL: https://recipe-blog-backend-production-RANDOM.up.railway.app
   ```

**Your backend is now live!** 🚀

---

## Phase 5: Connect Frontend to Backend

Your frontend (`index.html`) needs to know your backend URL for login/register.

### Step 5a: Find Your Backend URL

In Railway dashboard, under your Node.js service, you'll see a public URL like:
```
https://recipe-blog-backend-production-abc123.up.railway.app
```

### Step 5b: Update Frontend Auth Calls

In your `index.html`, find the auth form submit handler (inline script) and update the API URL:

**Search for** (or tell me to update it):
```javascript
fetch('/api/register', ...
fetch('/api/login', ...
```

**Change to**:
```javascript
const API_URL = 'https://recipe-blog-backend-production-abc123.up.railway.app'; // Replace with your Railway URL

fetch(API_URL + '/api/register', ...
fetch(API_URL + '/api/login', ...
```

Then:
```powershell
git add index.html
git commit -m "Update backend API URL for production"
git push
```

Vercel auto-redeploys and your frontend can now call the backend! ✓

---

## Phase 6: Test the Live Site

1. Visit your Vercel frontend: `https://recipe-blog-RANDOM.vercel.app`
2. Click "Login/Register"
3. Enter email, password, name
4. Click Register
5. You should see a success message or be logged in

**If you get an error:**
- Check browser console (F12 → Console tab) for CORS or network errors
- Verify `CORS_ORIGIN` in Railway matches your Vercel URL exactly
- Check Railway logs: click Node.js service → Deployments → View logs

---

## Summary: What You Get

| Component | URL | Platform |
|-----------|-----|----------|
| Frontend (HTML/CSS/JS) | `https://recipe-blog-RANDOM.vercel.app` | Vercel |
| Backend (Node/Express) | `https://recipe-blog-backend-production-XYZ.up.railway.app` | Railway |
| Database (Postgres) | Managed by Railway | Railway |

Both auto-scale for free and auto-deploy on git push! 🎉

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Git remote already exists" | Run `git remote remove origin` first |
| GitHub auth fails | Use Personal Access Token or GitHub CLI |
| Frontend shows blank or 404 | Check Vercel build logs; ensure `index.html` is in root |
| Backend shows "connection refused" | Wait 5 min; check Railway logs for errors; verify `DATABASE_URL` |
| Auth endpoints return 401/403 | Check `CORS_ORIGIN` in Railway exactly matches frontend URL |
| Database migration fails | Railway Postgres needs init; `server.js` `initDB()` should auto-create `users` table |

---

## Next: Optional Enhancements

- Add login history table (tell me if you want this)
- Set up custom domain (Vercel supports custom domains)
- Add CI/CD pipeline (auto-run tests on push)
- Monitoring & error tracking (Sentry, LogRocket)

---

## Questions?

Paste any error messages here and I'll debug!
