# Deploy Your Blog to GitHub

This guide walks you through deploying your blog website (frontend + optional backend) to GitHub and the web.

## What You Have

- **Frontend**: HTML, CSS, JS files in `c:\Users\boot\Desktop\blog` (static site)
- **Backend** (optional): Node.js auth server in `auth-server/` folder

## Deployment Options

| Option | Frontend | Backend | Cost | Difficulty |
|--------|----------|---------|------|------------|
| **GitHub Pages** (Recommended for frontend) | ✓ Free | ✗ Not supported | Free | Easy |
| **Vercel** | ✓ Free | ✓ Free tier | Free | Easy |
| **Netlify** | ✓ Free | ✓ Free tier | Free | Easy |
| **Heroku** (backend only) | ✗ | ✓ Paid (was free) | $7/mo+ | Medium |
| **Railway** (backend) | ✗ | ✓ Free tier | Free | Medium |
| **Render** (backend) | ✗ | ✓ Free tier | Free | Medium |

---

## Option 1: Deploy Frontend to GitHub Pages (Easiest)

### Step 1: Create a GitHub Account
1. Go to https://github.com/join
2. Sign up with email, password, and username
3. Verify your email

### Step 2: Create a New Repository
1. Go to https://github.com/new
2. Repository name: `blog` or `wendells-recipe-blog` (must be public)
3. Description: "My Filipino Recipe Blog"
4. Leave other settings as default
5. Click **Create repository**

### Step 3: Upload Files to GitHub (Using Command Line)

Open PowerShell and run these commands:

```powershell
# Navigate to your blog folder
cd C:\Users\boot\Desktop\blog

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Add blog with recipes and auth"

# Add GitHub as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/blog.git

# Push to GitHub (you will be prompted to authenticate)
git branch -M main
git push -u origin main
```

**If you get an error about authentication**, you may need to:
- Use a Personal Access Token (GitHub Settings → Developer settings → Personal access tokens).
- Or use SSH keys (more advanced).

I can provide exact steps if needed.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/USERNAME/blog
2. Click **Settings** (gear icon, top right).
3. On the left sidebar, click **Pages**.
4. Under "Source", select **Deploy from a branch** and choose `main` branch.
5. Click **Save**.
6. Wait ~1 minute and refresh. You should see a green box with your site URL:
   ```
   Your site is live at https://USERNAME.github.io/blog
   ```

### Step 5: View Your Site

Visit `https://USERNAME.github.io/blog` in your browser. Your blog is now live! 🎉

---

## Option 2: Deploy Frontend + Backend to Vercel (Recommended if you want both)

Vercel makes it very easy to deploy both frontend and Node.js backend from the same GitHub repo.

### Step 1: Connect GitHub and Vercel

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub** and authenticate.
3. Vercel will automatically detect your GitHub repo.

### Step 2: Import Your Repository

1. Click **Import Project**.
2. Paste your GitHub repo URL: `https://github.com/USERNAME/blog`
3. Click **Continue**.

### Step 3: Configure the Project

1. **Framework Preset**: Select **Other** (since you have custom HTML/CSS/JS).
2. **Root Directory**: Leave as `.` (root).
3. **Environment Variables** (optional): Add any secrets (e.g., `JWT_SECRET`, `DB_PASSWORD`):
   ```
   JWT_SECRET=your-secret-here
   DB_PASSWORD=your_password
   ```
   But **do NOT commit `.env` to GitHub** (keep it local or use Vercel secrets).
4. Click **Deploy**.

Vercel will build and deploy automatically. Your site will be at `https://blog-USERNAME.vercel.app`.

---

## Option 3: Deploy Backend Separately to Railway (Free Tier)

If you want the Node auth server running online:

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (click "Continue with GitHub").

### Step 2: Create a New Project

1. Click **Create a New Project** → **Deploy from GitHub repo**.
2. Select your `blog` repository.
3. Railway will detect `package.json` and create a Node.js service.

### Step 3: Add PostgreSQL Database

1. In the Railway project dashboard, click **+ Add**.
2. Select **Database** → **PostgreSQL**.
3. Railway automatically provisions a Postgres instance and adds env vars (`DATABASE_URL`).

### Step 4: Configure Environment Variables

Railway auto-detects and sets `DATABASE_URL`. You may need to add:
```
JWT_SECRET=your-secret
CORS_ORIGIN=https://yourfrontend.com
```

### Step 5: Deploy

1. Click **Deploy** (or auto-deploy on git push).
2. Railway provides a public URL (e.g., `https://blog-production.up.railway.app`).
3. Update your frontend `.env` or `index.html` to point auth requests to this URL.

---

## Step-by-Step: Push to GitHub Using PowerShell

### If This Is Your First Time Using Git:

```powershell
# Set your git config (replace with your GitHub email/name)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Initialize and Push:

```powershell
cd C:\Users\boot\Desktop\blog

# Check if git is already initialized
git status

# If not, initialize
git init

# Create a .gitignore file to exclude sensitive files
@"
node_modules/
auth-server/node_modules/
auth-server/.env
.env
.DS_Store
*.log
"@ | Out-File .gitignore -Encoding UTF8

# Add all files
git add .

# Commit
git commit -m "Initial commit: Blog with recipes and auth server"

# Add GitHub remote (replace USERNAME and REPONAME)
git remote add origin https://github.com/USERNAME/REPONAME.git

# Rename branch to main (GitHub default)
git branch -M main

# Push to GitHub (you will be prompted to authenticate)
git push -u origin main
```

### First-Time GitHub Authentication (Windows)

When you first push, PowerShell may prompt you:
- Use your **GitHub username** (not email).
- Use a **Personal Access Token** as password (not your GitHub password):
  1. Go to GitHub → Settings → Developer settings → Personal access tokens.
  2. Click "Generate new token (classic)".
  3. Give it a name (e.g., "Windows Dev").
  4. Check `repo` and `workflow` scopes.
  5. Click "Generate token" and copy it.
  6. Paste that token when PowerShell asks for password.

Or use **GitHub CLI** (easier):
```powershell
# Install GitHub CLI (if not already installed)
choco install gh

# Authenticate
gh auth login
# Follow prompts to authenticate with browser

# Then push (no password needed)
git push -u origin main
```

---

## Important Security Notes

### Do NOT commit these files to GitHub:
- `.env` (contains passwords and secrets)
- `auth-server/node_modules/` (included in .gitignore)
- Private keys or API tokens

### Create a `.env.example` (already done):
- Commit `auth-server/.env.example` with placeholder values.
- Users (or you on another machine) copy it to `.env` locally and fill in real values.

### For Production:
- Use strong `JWT_SECRET` (at least 32 random characters).
- Never hardcode secrets in code or `.env` — use platform env vars (Vercel, Railway, etc.).
- Set `CORS_ORIGIN` to your production domain only (not `*`).

---

## Next Steps After Deploy

1. **Test the live site**: Visit your GitHub Pages URL and ensure recipes display.
2. **Connect frontend to backend** (if deploying backend):
   - Update `index.html` auth modal to POST to your backend URL (e.g., `https://blog-production.up.railway.app/api/register`).
3. **Optional: Add login history table** (if using backend and want to track logins in pgAdmin).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Git not found" | Install Git for Windows: https://git-scm.com/download/win |
| "Remote origin already exists" | Run `git remote remove origin` then retry. |
| GitHub Pages not showing site | Wait 1-2 minutes and refresh. Ensure repo is **public**. Check **Settings → Pages** shows deploy status. |
| Auth not working after deploy | Ensure `CORS_ORIGIN` in backend matches your frontend URL. Check browser console for CORS errors. |
| Backend fails to start on Vercel/Railway | Ensure all env vars (`JWT_SECRET`, `DB_*`) are set in platform dashboard. Check logs. |

---

## Questions or Next Steps?

Tell me:
1. Which deployment option you prefer (GitHub Pages for frontend only, or Vercel/Railway for both)?
2. Do you have a GitHub account already?
3. Should I help you set up the git commands, or would you like me to guide you step-by-step?

I can create exact commands tailored to your setup if needed.
