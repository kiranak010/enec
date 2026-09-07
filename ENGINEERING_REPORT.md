# Engineering Report — Emirates Nuclear Energy Corporation (ENEC)

Project root: `D:\ENEC`
Delivered: corporate website + CMS, verified production build, 35 passing tests.

## 1. Summary

A complete, production-grade corporate website for a fictional global nuclear
energy corporation. It includes a 50-route public marketing site, an
RBAC-protected content management system with server actions, role-based access
control, JWT-session authentication, full-text search, a document library,
career listings with applications, and audit logging. Verification: production
build (69 generated routes), ESLint clean, TypeScript clean, 35/35 tests passing.

## 2. Stack & Rationale

| Concern        | Choice                          | Why                                                                 |
| -------------- | ------------------------------- | ------------------------------------------------------------------- |
| Framework      | Next.js 16.3.4 (App Router)     | RSC server/client boundaries, SSG, route-level caching, Proxy        |
| Language       | TypeScript                      | Type safety across server actions, DB models, and components         |
| Styling        | Tailwind CSS v4                 | Design-token theming via `@theme`, mobile-first utilities            |
| Database       | Prisma 6.19 + SQLite            | Zero-config local runs (no PostgreSQL/Docker available); schema is   |
|                |                                 | PostgreSQL-compatible for production swap                            |
| Auth           | `jose` JWT, httpOnly cookie     | Stateless sessions; no session table needed                          |
| Validation     | Zod                             | Shared schemas for every server action / form                        |
| Data fetching  | Prisma (server components)      | Direct DB reads with Next.js `cache()` per-request                    |
| Animations     | `motion`                        | Homepage hero/innovation/stat counters                               |
| Testing        | Vitest                          | Unit (utils, RBAC, session crypto) + DB integration                   |

Environment constraints honored: Node v24.18.0, npm 11.16.0, Windows,
no Docker, no PostgreSQL server. SQLite was the only zero-infrastructure option
and the schema was written to make an async swap to PostgreSQL a one-line
`provider` change.

## 3. Architecture

### 3.1 Routing & Rendering

- Public marketing pages are **static** (`○`) and prerendered at build time.
- `news/[slug]`, `projects/[slug]`, `careers/jobs/[slug]` are **SSG** (`●`) via
  `generateStaticParams`, hydrated from the seeded DB at build time.
- Admin routes are **dynamic** (`ƒ`) — server-rendered on demand behind the Proxy.
- `app/sitemap.xml` and `app/robots.txt` are generated at build time.
- `proxy.ts` (Next 16 replacement for `middleware.ts`) does the optimistic
  cookie-presence check for `/admin`; the definitive authorization happens
  server-side in every admin page and server action.

### 3.2 Data Model (`prisma/schema.prisma` — 18 entities)

Users, Sessions, Pages/PageRevisions, News (categories, tags, articles —
many-to-many), Projects (+milestones, images), Leadership, Jobs + Applications,
Documents, Sustainability metrics, Contact messages, Media assets, Site settings,
Navigation items, Audit log, Page views.

### 3.3 Auth & RBAC

- JWT signed with `SESSION_SECRET` (HS256), `enec_session` cookie, 7-day expiry.
- Roles: `SUPER_ADMIN → ADMIN → EDITOR / HR_MANAGER / MEDIA_MANAGER → ANALYST → VIEWER`.
- `hasPermission(role, permission)` implements namespace-wildcard permissions
  (e.g. `news:*` grants `news:create/read/update/delete`).
- Every admin page calls `verifyAdmin()`; every admin server action calls
  `requireAdmin()` + `hasPermission()`.

### 3.4 Server Actions (mutations)

- 33 actions in `app/admin/actions.ts` (create/update/delete for pages, news,
  projects, jobs, leadership, documents, media, sustainability, users, settings).
- Contact form, job application, login/logout as dedicated actions.
- All accept `FormData`, validate with Zod, revalidate the relevant cache/paths,
  write an audit-log entry, and redirect via next/navigation.

## 4. Features Delivered (map to brief)

- **Corporate site:** about, history, leadership, governance, nuclear-energy,
  technology, safety, sustainability (environment/reports/community), innovation
  + research, safety page.
- **Editorial:** news list + article pages with categories/tags, media center,
  document library with searchable/filterable list and file downloads.
- **Investor/hub:** projects with status/milestones/images; careers with job
  listings and full application workflow; supplier program page.
- **Engagement:** contact form with rate limiting (60s cookie window),
  full-text site search across pages/news/projects/jobs/documents.
- **CMS:** dashboard with KPI cards, CRUD + publish/draft workflows for all
  content types, media uploads (local `/uploads`), site settings, user
  management (SUPER_ADMIN only), audit-log viewer.
- **SEO & a11y:** metadata API, JSON-LD Organization schema, sitemap/robots,
  semantic HTML, skip link, ARIA labels, keyboard-accessible menus.
- **Brand system:** centralized `config/site.ts`; navy/cyan/amber theme tokens.

## 5. Security Measures

- httpOnly, sameSite=lax session cookie; `secure` flag in production.
- Passwords hashed with bcrypt (cost 10); never logged or returned.
- Server-side authorization on every admin page **and** server action (the Proxy
  is not the security boundary).
- Zod validation on every input; no raw SQL; parameterized Prisma queries.
- Rate limiting on the contact form; audit log records actor/action/resource per
  mutation.
- `.env`, `prisma/dev.db`, and build artifacts are gitignored.

## 6. Testing

| Suite                | Scope                                              | Count |
| -------------------- | -------------------------------------------------- | ----- |
| `tests/utils.test.ts`| `cn`, `slugify`, `formatDate`, `truncate`, `readingTime` | 13 |
| `tests/dal.test.ts`  | RBAC `hasPermission`, `canAccessAdmin`, `canManageContent` | 9 |
| `tests/session.test.ts` | JWT encrypt/decrypt round-trip, tamper/expiry rejection | 5 |
| `tests/db.integration.test.ts` | Live seeded DB queries (news, projects, jobs, docs, users, leadership, metrics, settings) | 8 |

Run with `npm test` (Vitest). The suite revealed and fixed a real defect:
`expiresAt` was dropped from the signed JWT payload — now included.

## 7. Verification

- `npm run build` — **Compiled successfully**, 69/69 static routes generated.
- `npm run lint` — **clean** (0 errors, 0 warnings).
- `npm run typecheck` — **clean**.
- Live smoke test: all 32 public routes + 14 admin routes returned HTTP 200;
  `/admin` correctly 302-redirects unauthenticated requests to
  `/admin/login?next=…`; seeded login credentials verified against bcrypt hashes.
- Known audit finding: 3 high-severity advisories in `@prisma/config` →
  `deepmerge-ts` (dev-only CLI tooling, no fix available); no runtime impact.

## 8. Deployment

1. Switch Prisma `provider` to `postgresql` and set `DATABASE_URL`.
2. Provide `SESSION_SECRET` (long random) and `NEXT_PUBLIC_SITE_URL`.
3. `npm ci && npx prisma migrate deploy && npm run build`.
4. Static hosting of `.next` is not recommended — run `next start` or a
   Node-compatible host (Vercel, Railway, Fly.io).
5. Change the seeded admin credentials before going live.

## 9. Known Scope Notes

- All people, plants, figures, and documents are fictional seed content for a
  demonstration site; the brief's stance on never representing real-world
  entities/facts was upheld.
- SQLite is a single-file local database; PostgreSQL required for concurrent
  multi-instance production traffic.
- Media uploads store to the local filesystem in development; object storage
  (S3) is the intended production path (config hooks exist in `.env`).