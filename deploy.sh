#!/usr/bin/env bash
#
# ENEC production deploy script — run on a Hostinger VPS (Ubuntu 24.04).
#
# Prereqs (done once):
#   ssh root@YOUR_SERVER_IP
#   apt update && apt upgrade -y
#   apt install -y build-essential git nginx ufw
#   curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs
#   apt install -y postgresql postgresql-contrib   # then create DB/user (see below)
#   npm install -g pm2
#   git clone https://github.com/kiranak010/enec.git /var/www/enec
#
# After the first run, re-running this script pulls latest + rebuilds + restarts.

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration — set these before running
# ---------------------------------------------------------------------------
ENEC_DIR="/var/www/enec"
ENEC_BRANCH="main"
ENEC_PORT="${ENEC_PORT:-3000}"
ENEC_USER="${ENEC_USER:-enec}"
DOMAIN="${DOMAIN:-yourdomain.com}"       # used only for the nginx/certbot notes

# ---------------------------------------------------------------------------
# 1. Pull latest code
# ---------------------------------------------------------------------------
echo "==> Pulling latest code ($ENEC_BRANCH)"
cd "$ENEC_DIR"
git fetch origin
git checkout "$ENEC_BRANCH"
git pull --ff-only origin "$ENEC_BRANCH"

# ---------------------------------------------------------------------------
# 2. Install dependencies (postinstall runs `prisma generate`)
# ---------------------------------------------------------------------------
echo "==> Installing dependencies"
npm ci || npm install

# ---------------------------------------------------------------------------
# 3. Load environment variables
#    Expects a `.env` file in $ENEC_DIR. Create it once:
#      cp .env.example .env
#      DATABASE_URL (postgres), SESSION_SECRET, NEXT_PUBLIC_SITE_URL
# ---------------------------------------------------------------------------
if [ ! -f "$ENEC_DIR/.env" ]; then
  echo "!! .env not found. Copy .env.example to .env and fill in values first." >&2
  exit 1
fi
set -a; . "$ENEC_DIR/.env"; set +a

# ---------------------------------------------------------------------------
# 4. Apply DB schema + seed (only if tables are missing / every deploy optional)
#    Note: `prisma db push` is fine for no-migration workflows. If you later run
#    prisma migrations, prefer `prisma migrate deploy` here instead.
# ---------------------------------------------------------------------------
echo "==> Syncing database schema"
npx prisma db push --accept-data-loss

# ---------------------------------------------------------------------------
# 5. Build
# ---------------------------------------------------------------------------
echo "==> Building"
npm run build

# ---------------------------------------------------------------------------
# 6. Restart the app under PM2
# ---------------------------------------------------------------------------
echo "==> (Re)starting PM2 process"
if pm2 describe enec >/dev/null 2>&1; then
  pm2 restart enec --update-env
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo
echo "==> Deploy complete."
echo "    App runs on port $ENEC_PORT via PM2."
echo "    Point HTTP/HTTPS at it with Nginx and certbot (see guide)."
echo "    Domain configured for this run: $DOMAIN"