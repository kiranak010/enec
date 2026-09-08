// PM2 process configuration for production (Hostinger VPS self-host).
//
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup systemd
//
// Env vars are loaded from .env in the app directory by Next.js at runtime,
// so no env block is needed here. Customize `name` if you prefer.
module.exports = {
  apps: [
    {
      name: 'enec',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // `--enable-source-maps` set via NODE_OPTIONS is optional; add if desired.
    },
  ],
};