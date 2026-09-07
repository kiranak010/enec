# Emirates Nuclear Energy Corporation — Corporate Website

A production-grade corporate website and content management system for a fictional
global nuclear-energy corporation. Built with Next.js 16 (App Router, Turbopack),
TypeScript, Tailwind CSS v4, Prisma, and SQLite.

## Tech Stack

- **Framework:** Next.js 16.3.4 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4 (`@theme` design tokens)
- **Database:** Prisma 6.19 + SQLite (`prisma/dev.db`) — schema is PostgreSQL-compatible
- **Auth:** JWT sessions (`jose`), httpOnly cookie, role-based access control (RBAC)
- **Validation:** Zod
- **Animations:** `motion`
- **Icons:** lucide-react
- **Tests:** Vitest (unit + DB integration)

## Quick Start

```bash
npm install
npm run db:push      # create the SQLite schema
npm run db:seed      # seed the database with demo content
npm run dev          # http://localhost:3000
```

Seed logins:

| Role        | Email                          | Password  |
| ----------- | ------------------------------ | --------- |
| Super Admin | admin@enec.gov.ae         | admin123  |
| Editor      | editor@enec.gov.ae        | editor123 |

> Change these credentials and the `SESSION_SECRET` in `.env` before any real deployment.

## Scripts

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start the dev server (Turbopack)           |
| `npm run build`      | Production build (static generation)       |
| `npm run start`      | Serve the production build                 |
| `npm run lint`       | ESLint                                     |
| `npm run typecheck`  | TypeScript type checking                   |
| `npm test`           | Run all tests (Vitest)                     |
| `npm run test:watch` | Run tests in watch mode                    |
| `npm run db:push`    | Sync the Prisma schema to SQLite           |
| `npm run db:seed`    | Seed the database                          |
| `npm run db:studio`  | Open Prisma Studio                         |

## Environment Variables

See `.env` (gitignored):

- `DATABASE_URL` — `file:./dev.db` for local SQLite
- `SESSION_SECRET` — secret used to sign session JWTs (required)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for sitemap/robots/metadata

## Project Structure

```
app/                          # Next.js App Router routes
  admin/                      # RBAC-protected CMS (pages, news, projects, jobs, …)
  (marketing)/                # Public routes (about, careers, contact, etc.)
  home/                       # Homepage section components
components/
  ui/                         # Button, SectionHeading, StatCounter
  admin/                      # Shared admin UI
config/site.ts                # Centralized brand/contact config
lib/
  auth/                       # JWT session + RBAC (dal.ts, session.ts)
  utils.ts                    # cn, slugify, formatDate, readingTime
prisma/
  schema.prisma               # Data model (18 entities)
  seed.ts                     # Demo content
tests/                        # Vitest unit + integration tests
proxy.ts                      # Next 16 proxy (formerly middleware) guarding /admin
```

## Admin Access Control

All `/admin/*` routes are guarded by `proxy.ts` (cookie presence) **and** a
server-side session verification (`verifyAdmin` in `lib/auth/dal.ts`). Server
actions re-verify the session and enforce role-based permissions per feature
(`hasPermission`). Every mutation writes an `AuditLog` entry.

## Deployment Notes

- **SQLite** is used for zero-config local development; switch the Prisma
  `provider` to `postgresql` and set `DATABASE_URL` for production.
- Static pages (public marketing, sitemap, robots) are prerendered at build time.
  Dynamic routes (news/projects/jobs detail) are SSG from the database.
- Set `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` in the host environment.
- `npm audit` reports high-severity issues only in `@prisma/config` dev tooling
  (`deepmerge-ts`) with no fix available; it does not affect the app runtime.