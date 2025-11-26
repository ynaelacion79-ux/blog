# Connect Your PostgreSQL Database to pgAdmin

pgAdmin is already connected to your Postgres **server** (localhost:5432), but you need to verify that your **database** and **user** are set up and accessible.

## Quick Summary: What You Should Have

If you followed the pgAdmin setup earlier:
- ✓ PostgreSQL server running on `localhost:5432`
- ✓ Database `wendells_recipe` exists
- ✓ User/Role `admin` exists with password `adminpassword`
- ✓ pgAdmin is open at `http://localhost:5050`

## Verify in pgAdmin (Visual Steps)

### Step 1: Open pgAdmin
- Go to http://localhost:5050 in your browser
- Log in with your pgAdmin account (usually same as Postgres superuser credentials)

### Step 2: Expand the Server
- On the left sidebar, look for **Servers**
- Click the arrow next to it to expand
- You should see your PostgreSQL server (e.g., "PostgreSQL 15" or "Local")
- If it shows a red X, right-click → **Connect Server** and enter the superuser password

### Step 3: Expand the Database
- Under your server, expand **Databases**
- Look for `wendells_recipe`
- Click on it
- You should see **Schemas** → **public**

### Step 4: Verify Tables
- Expand **Schemas** → **public** → **Tables**
- You should see the `users` table (created by your auth server when it started)
- If `users` table doesn't exist, it means the server hasn't created it yet (make sure your auth server ran and showed `Users table ready`)

### Step 5: Query the Users Table (Optional)
- Right-click the `users` table → **View/Edit Data** → **All Rows**
- Or right-click **Databases** → **Query Tool** and run:
  ```sql
  SELECT * FROM users;
  ```
- This should show any registered users (empty if no one registered yet)

---

## Troubleshooting: If You Can't See the Database

| Problem | Solution |
|---------|----------|
| Server shows red X | Right-click server → **Connect Server** → enter Postgres superuser password |
| No `wendells_recipe` database listed | Create it using the pgAdmin setup steps or run: `CREATE DATABASE wendells_recipe OWNER admin;` in Query Tool |
| `admin` user doesn't exist | Create it: Right-click **Login/Group Roles** → **Create** → **Login/Group Role** → name `admin`, set password `adminpassword` |
| Can't access database as `admin` | Run this SQL in Query Tool as superuser: `GRANT ALL PRIVILEGES ON DATABASE wendells_recipe TO admin;` |
| `users` table doesn't exist | Start your Node auth server (`npm start` in `auth-server` folder) — it will auto-create the table |
| Permission denied when querying | Run the permissions SQL from `auth-server/grant_permissions.sql` (copy/paste into pgAdmin Query Tool) |

---

## Test Your Database Connection from Node

Once pgAdmin shows the `users` table, your auth server can also write to it. Test by:

1. Start the auth server:
   ```powershell
   cd C:\Users\boot\Desktop\blog\auth-server
   npm start
   ```

2. You should see:
   ```
   Auth server listening on http://localhost:5100
   Users table ready
   ```

3. Open another browser tab and test the register endpoint:
   - Go to: `http://localhost:5100/health`
   - You should see: `{"ok":true}`

4. Test registration (using a tool like Postman or curl):
   ```bash
   curl -X POST http://localhost:5100/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```
   - Expected response: `{"user":{"id":1,"name":"Test User","email":"test@example.com"},"token":"..."}`

5. Check pgAdmin to verify the user was inserted:
   - In pgAdmin, right-click `users` table → **View/Edit Data** → **All Rows**
   - You should see your new user!

---

## View Login History (Optional - Future Step)

Once I add login history tracking to your server, you can view login events in pgAdmin:
```sql
SELECT * FROM login_history ORDER BY created_at DESC LIMIT 20;
```

Want me to add this feature now?

---

## Summary

Your database is **already connected to pgAdmin** if:
- ✓ pgAdmin is open and you can see your PostgreSQL server
- ✓ `wendells_recipe` database is visible
- ✓ `admin` user exists and can connect
- ✓ `users` table exists (created by your Node server)

**Next step**: If everything above checks out, commit your code to Git and deploy to Vercel + Railway!

Questions? Paste any pgAdmin errors here.
