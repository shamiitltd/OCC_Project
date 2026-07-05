# 🚀 OCC Deployment & CI/CD Guide — tip.offcampuscareer.com (HestiaCP VPS)

> **Prepared by**: Antigravity AI  
> **Project**: Offcampuscareer (OCC) — SHAMIIT LLP  
> **Target**: `tip.offcampuscareer.com` on Hostinger VPS with HestiaCP

This guide covers both **manual deployment** and setting up the automated **GitHub Actions CI/CD pipeline** to push your updates automatically when you push to the `main` branch.

---

## Part 1: Automated CI/CD Setup (GitHub Actions)

We have configured a fully automated build and deploy pipeline in `.github/workflows/deploy.yml`. When you push to the `main` branch, GitHub will automatically:
1. Install Node.js dependencies in `occ-web-app`
2. Build your React app (`npm run build`)
3. Packages the static files (`dist`), backend APIs (`api`), DB scripts (`db`), and Apache routes (`.htaccess`)
4. SFTP/SCP them to your VPS under `/home/user/web/tip.offcampuscareer.com/public_html`
5. Automatically set folder permissions for database, uploads, and API files.

### Step 1 — Configure GitHub Secrets
Go to your GitHub repository: **Settings** → **Secrets and variables** → **Actions** → Click **New repository secret** and add the following:

| Secret Name | Value | Description |
|---|---|---|
| `VPS_SSH_HOST` | `187.127.158.6` | The IP address of your Hostinger VPS |
| `VPS_SSH_USERNAME` | `user` | The HestiaCP user owning the web domain |
| `VPS_SSH_PASSWORD` | `naresh@SHAMIIT1` | The password for the SSH/SFTP user |
| `VPS_SSH_PORT` | `22` | The SSH port (usually `22`) |

> 🔒 *Note: If you prefer to use SSH keys instead of a password (more secure), you can generate a key pair on the server, append the public key to `/home/user/.ssh/authorized_keys`, and save the private key as `VPS_SSH_KEY` in GitHub Secrets instead.*

---

## Part 2: Manual Deployment & Server Setup

### STEP 1 — Create the Subdomain in HestiaCP
1. Log in to HestiaCP: `https://187.127.158.6:8083` (username: `user`, password: `naresh@SHAMIIT1`)
2. Click **"Web"** in the top menu
3. Locate `tip.offcampuscareer.com` (already created!)

### STEP 2 — Enable SSL (HTTPS) via Let's Encrypt
1. In HestiaCP → **Web** → find `tip.offcampuscareer.com` → click **Edit** (pencil icon)
2. Scroll down to the **SSL Certificate** section:
   - Check **"Enable SSL for this domain"**
   - Check **"Use Let's Encrypt to obtain SSL certificate"**
   - Check **"Enable automatic HTTPS redirect"** (Optional but highly recommended)
3. Click **Save** (Wait 1–2 minutes for SSL certificate completion)

### STEP 3 — Configure MySQL Database on HestiaCP
We use MySQL in production for high performance and concurrency:
1. In HestiaCP, click **"DB"** in the top navigation bar.
2. Click **"Add Database"**.
3. Enter these credentials:
   - **Database**: `user_tip` (It may prefix with Hestia username: `user_user_tip`. Match this with your `api/db.php` if different)
   - **User**: `user_tip` (or `user_user_tip`)
   - **Password**: `Cz7Ttut@Tqlh|/WR`
   - **Host**: `localhost` (default)
4. Click **Save**.

---

### STEP 4 — File Upload Structure
If doing a manual upload (via FileZilla/SFTP), upload the build directory content to `/home/user/web/tip.offcampuscareer.com/public_html/`:

```
📁 public_html/                 ← WEBROOT
├── .htaccess                  ← ⭐ CRITICAL: SPA router & security configs
├── index.html                 ← React entrypoint (from occ-web-app/dist/)
├── assets/                    ← React bundles (from occ-web-app/dist/assets/)
│   ├── index-[hash].css
│   ├── index-[hash].js
│   ├── vendor-[hash].js
│   └── rolldown-runtime-[hash].js
├── logo.png                   ← Logos and static assets
├── offcampuscareer logo.png
├── favicon.svg
├── icons.svg
├── api/                       ← PHP REST backend
│   ├── auth.php
│   ├── courses.php
│   ├── jobs.php
│   ├── admin.php
│   ├── student.php
│   ├── checkout.php
│   ├── contact.php
│   ├── db.php                 ← Database connection info
│   └── init_db.php            ← Database setup endpoint
├── db/
│   └── mysql-schema.sql       ← Production database structure
└── resumes/                   ← Placeholder for uploaded student resumes (keep empty)
```

> ⚠️ **Do NOT upload** `occ-web-app/node_modules/`, local `php-bin/`, or the raw `.git` folder.

---

### STEP 5 — Set File Permissions on VPS
If deploying manually, run these commands via SSH (or set via FileZilla right-click):

```bash
WEBROOT="/home/user/web/tip.offcampuscareer.com/public_html"

# Ensure directories have 755 permissions
chmod 755 "$WEBROOT/db"
chmod 755 "$WEBROOT/resumes"

# Ensure files have 644 permissions
chmod 644 "$WEBROOT/api/"*.php
chmod 644 "$WEBROOT/.htaccess"

# Grant write permissions to webserver user
chown -R www-data:www-data "$WEBROOT/db"
chown -R www-data:www-data "$WEBROOT/resumes"
```

---

### STEP 6 — Initialize Database Schema & Seed Data
Initialize and populate your new MySQL tables:
1. Open your browser and navigate to:
   ```
   https://tip.offcampuscareer.com/api/init_db.php
   ```
2. You will see confirmation logs of schema creation and default seeding.
3. ⚠️ **SECURITY WARNING**: Delete the file `api/init_db.php` from your server immediately after initialization so no one can reset your database!
   ```bash
   rm /home/user/web/tip.offcampuscareer.com/public_html/api/init_db.php
   ```

---

## STEP 7 — Verification Checklist

Verify the following pages load and APIs return records successfully:

| URL | Expected Behavior |
|---|---|
| `https://tip.offcampuscareer.com/` | Public homepage displays with dark theme |
| `https://tip.offcampuscareer.com/training` | Courses show up |
| `https://tip.offcampuscareer.com/portal` | Login portal loads |
| `https://tip.offcampuscareer.com/api/courses.php` | Returns raw JSON array of 6 courses |

### Test Login Accounts:

*   **Admin**: `admin@oc2.in` / `admin123`
*   **Student**: `rahul@demo.com` / `demo123`
*   **Student 2**: `priya@demo.com` / `demo123`
