# pgAdmin Setup Guide for Auth Server

This guide walks you through creating a Postgres user and database using the pgAdmin GUI so the auth server can connect.

## What you need to create:
- **Database**: `wendells_recipe`
- **User/Role**: `admin` with password `adminpassword`

## Step-by-Step Instructions

### 1. Open pgAdmin
- Look for "pgAdmin 4" in your Start Menu or applications.
- Open it. It will likely open in your web browser (e.g., `http://localhost:5050`).
- If prompted for a password, use the email/password you set during Postgres installation (usually the superuser credentials).

### 2. Connect to Your Postgres Server (if not already connected)
- On the left sidebar, expand **Servers** (if there is a dropdown arrow, click it).
- You should see your Postgres server listed (e.g., "PostgreSQL 15" or similar).
  - **If you see it**: Right-click on it → select **Connect Server** → enter your Postgres superuser password.
  - **If you don't see a server**: Right-click on **Servers** → select **Create** → **Server**.
    - Give it a name (e.g., "Local PostgreSQL").
    - Go to the **Connection** tab.
    - Set **Host name/address** to `localhost`.
    - Set **Port** to `5432`.
    - Set **Username** to `postgres` (the superuser).
    - Leave **Password** blank or enter the superuser password if you have one.
    - Leave **Save password?** checked for convenience.
    - Click **Save**.

### 3. Create a New Login Role (User) named "admin"
- On the left sidebar, expand your Postgres server (click the arrow).
- Right-click on **Login/Group Roles**.
- Select **Create** → **Login/Group Role**.
- In the dialog that opens:
  - **General tab**:
    - **Name**: `admin`
  - **Definition tab**:
    - **Password**: `adminpassword`
    - Confirm password: `adminpassword`
    - **Privileges section**: toggle **Can login?** to ON (should be by default).
  - **Privileges tab** (optional for now, skip for simplicity):
    - Leave as default.
  - Click **Save**.

You should now see `admin` in the **Login/Group Roles** list.

### 4. Create a New Database named "wendells_recipe"
- On the left sidebar, right-click on **Databases** (under your Postgres server).
- Select **Create** → **Database**.
- In the dialog:
  - **General tab**:
    - **Database**: `wendells_recipe`
    - **Owner**: click the dropdown and select `admin` (the role you just created).
  - **Definition tab**: leave as default (UTF8 encoding, etc.).
  - **Security tab**: leave as default.
  - Click **Save**.

You should now see `wendells_recipe` in the **Databases** list, owned by `admin`.

### 5. Grant Full Privileges (optional but recommended)
- In the left sidebar, expand your Postgres server.
- Expand **Databases** and click on `wendells_recipe`.
- Right-click on **Schemas** and then the `public` schema.
- Select **Grant Wizard...** (if available) or manually:
  - Right-click `public` → **Properties**.
  - Go to the **Security** tab.
  - Click **Add** and grant `admin` role all privileges (SELECT, INSERT, UPDATE, DELETE, etc.).
  - Click **Save**.

Or simply right-click the `wendells_recipe` database → **Properties** → **Security** and ensure the `admin` role has privilege to connect and create objects.

### 6. Test the Connection from the Auth Server

Once the database and user are created, start the auth server:

```powershell
cd C:\Users\boot\Desktop\blog\auth-server
npm start
```

If the server starts successfully, you should see:
```
Auth server listening on http://localhost:5100
Users table ready
```

If you see an error like `FATAL: password authentication failed for user "admin"`, it means:
- The password in pgAdmin does not match `adminpassword` in `.env`.
- Or the user was not created correctly.
  - Go back to pgAdmin, right-click the `admin` role → **Properties** → **Definition** tab → re-enter the password and save.

### 7. View Login History (Optional - Next Step)

Once the server is running, you can view login records by:
- In pgAdmin, right-click the `wendells_recipe` database → **Query Tool**.
- Paste and run:
  ```sql
  SELECT * FROM login_history ORDER BY created_at DESC LIMIT 20;
  ```
- (This table will exist only if the server has code to create and log to it.)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| pgAdmin won't open in browser | Ensure Postgres and pgAdmin services are running. Check http://localhost:5050 or restart both services. |
| Can't connect to server in pgAdmin | Ensure Postgres is running. Right-click server → **Properties** → check Host, Port, Username. Try password: leave blank or enter superuser password. |
| Role `admin` already exists | Right-click it → **Delete/Drop** if you want to recreate. Or skip to step 4 (create database). |
| Database `wendells_recipe` already exists | Skip step 4 or right-click it → **Delete/Drop** if you want to recreate. |
| Auth server still says "password authentication failed" | In pgAdmin, right-click `admin` role → **Properties** → **Definition** → verify password is exactly `adminpassword` → Save. |
| I forgot the pgAdmin login password | pgAdmin login is separate from Postgres. If you forgot pgAdmin password, you may need to reset it (depends on your pgAdmin configuration). Postgres superuser password is separate. |

---

**Next**: After the server is running, test it by opening a browser and going to `http://localhost:5100/health` — you should see `{"ok":true}`.
