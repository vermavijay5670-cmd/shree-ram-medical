# Shree Ram Medical Agency — Platform

A Next.js 16 (App Router) build-out of the platform described in `BUILD_BRIEF.md`, using the six
approved HTML reference demos as the visual source of truth. This README explains what's real,
what's mocked, and what's left before this is a production system.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The whole marketing site, catalogue, admin dashboard and partner
portal run out of the box against **in-memory mock data** — no database required to explore it.

**Try logging in** at `/login` with one of the seeded demo accounts (also shown on the login
screen itself):

| Role      | Email                                       | Password         |
|-----------|----------------------------------------------|------------------|
| Admin     | admin@shreerammedical.example               | admin123         |
| Retailer  | anita@sanjeevanipharmacy.example            | retailer123      |
| Hospital  | manoj@ashanursinghome.example               | hospital123      |

Registering a new account at `/register` actually works too — it's appended to the in-memory user
list for the life of the server process (resets on restart, since there's no database yet).

## What's real vs. mocked right now

This scaffold follows the brief's milestone order (§8). Milestones 3–4 (shared components +
marketing pages) and most of 5–6 (auth + admin) are built; milestones 1–2 and part of 7–8
(a real Postgres database, SEO/performance pass, deploy) are the natural next steps.

| Area | Status |
|---|---|
| Design system (colors, type, motion, glass cards, cursor glow, 3D tilt) | ✅ Ported exactly from the HTML demos into CSS variables + CSS Modules |
| Homepage, Companies (grid + profile), Medicines (catalogue + detail) | ✅ Fully rebuilt, pixel-faithful to the demos, backed by real (non-lorem-ipsum) pharma data |
| Admin dashboard | ✅ Rebuilt with **Recharts** (per brief) instead of the demo's Chart.js stand-in; all numbers are computed from data, not hardcoded |
| Admin sub-pages (companies/medicines/categories/inventory/orders/retailers/analytics/gallery/FAQs/contact-requests) | ✅ Functional table/list views, not in the original 6 demos but required by the site architecture in §4 |
| Auth (NextAuth v5, credentials, role-based sessions) | ✅ Actually functional — JWT sessions, no DB required. Swap `lib/data/users.ts` lookups for a Prisma query once the DB is live |
| Route gating (`/admin/*`, `/portal/*`) | ✅ `proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`; see note below) |
| Partner portal (dashboard/orders/invoices/wishlist/requests) | ✅ Functional, scoped to the logged-in user's mock orders |
| Marketing pages (about/services/contact/blog/gallery/faq/categories) | ✅ Real, specific copy — not in the original demos, but required by §4's site map |
| Contact form + registration | ✅ Real client-side validation (Zod + React Hook Form) posting to real API routes, storing in-memory |
| **Database** (Postgres via Prisma) | ⏳ Schema written (`prisma/schema.prisma`) and seed script written (`prisma/seed.ts`), but **not connected** — see below |
| Cloudinary image upload | ⏳ Wired for `next/image` remote patterns; actual upload UI is a placeholder on `/admin/gallery` |
| 3D hero (React Three Fiber) | ⏳ Still the CSS/SVG capsule field from the demo — brief explicitly allows this as a fallback |
| GSAP / Lenis smooth scroll | ⏳ Not added — current motion uses Framer Motion + IntersectionObserver, which covers everything currently on the pages |
| Enquiry "cart" (add multiple medicines to one quote request across pages) | ⏳ `MedicineCard`'s "Request Quote" button is currently inert; needs a global cart context — see below |
| SEO pass, sitemap, JSON-LD, Lighthouse tuning | ⏳ Not started (§8 milestone 7) |

## Connecting the real database

The whole app currently reads from `lib/data/*.ts` — plain TypeScript modules that export the same
shape as the Prisma models (see `lib/types.ts`). This was a deliberate choice so the entire product
is explorable without any infrastructure. To go live:

1. Create a Supabase Postgres project and copy the connection string into `.env` as `DATABASE_URL`
   (copy `.env.example` → `.env` first).
2. `npm run db:generate` (runs `prisma generate` — needs internet access to Prisma's engine CDN,
   which this sandbox's network policy blocked during scaffolding, so it hasn't been run yet here).
3. `npm run db:push` to create the tables (or set up `prisma migrate` if you want migration history).
4. `npm run db:seed` — this runs `prisma/seed.ts`, which reads the exact same `lib/data/*` used by
   the mock layer, so your seeded database will match what you've been looking at in dev.
5. Swap the `lib/data/*.ts` functions for real `prisma.*.findMany()` calls (or introduce a React
   Query layer per the brief's data-fetching choice) one page at a time. Function names
   (`getCompanies`, `getMedicineBySlug`, `getOrdersForUser`, etc.) were deliberately written to
   mirror what the eventual Prisma queries will look like.
6. Point `lib/auth.ts`'s `authorize()` at a real `prisma.user.findUnique()` + bcrypt compare instead
   of `lib/data/users.ts`.

**Schema note:** `prisma/schema.prisma` matches `BUILD_BRIEF.md` §5 exactly, with one addition —
an `OrderItem` join model between `Order` and `Medicine`. The brief's `Order` model had no way to
know *what* was ordered, which the admin analytics need (revenue by company, top medicines by
volume). The brief explicitly invites this ("expand relations as needed").

## Next.js 16, not 15

`create-next-app@latest` installed **Next.js 16.2.10** (the brief specifies Next.js 15). This was
a deliberate choice — 16 is the current stable release and a strict superset of the App Router
architecture the brief describes — but it does mean a couple of conventions differ from what you
might expect from a Next 15-era brief:

- **`params` is now `Promise<{...}>`** in every dynamic route — every `page.tsx` under
  `[companySlug]`, `[medicineSlug]`, `[categorySlug]`, and `blog/[slug]` already `await`s it.
- **`middleware.ts` is renamed `proxy.ts`** (root-level, `nodejs` runtime only — no Edge runtime).
  Route gating for `/admin/*` and `/portal/*` lives in `proxy.ts`.
- Tailwind is v4, which is CSS-first (`@theme` block in `app/globals.css`) rather than
  `tailwind.config.js`. All the brief's design tokens live there as CSS variables.

If your team's tooling specifically requires Next 15, `npm i next@15 eslint-config-next@15` should
be a small diff — nothing in this codebase relies on 16-only features beyond the two conventions
above (and rolling back would mean reverting those two patterns).

## Fonts

`lib/fonts.ts` uses `next/font/google` for Space Grotesk + Inter, exactly as specified in the
brief. This needs outbound internet access to Google's font CDN at build time — completely normal
for local dev, CI, and Vercel, but worth knowing if you build in a network-restricted environment.

## What to build next (in priority order)

1. **Enquiry cart** — a `CartContext` (React context + `localStorage` is fine client-side, or a
   `Zustand` store) so "Request Quote" on any `MedicineCard` adds to a running cart, with a
   floating cart bar and a `/enquiry` review-and-submit page that posts to `/api/enquiries`.
2. **Wire the database** per the section above — this unlocks real registration, persistent
   wishlists, and admin CRUD (currently the admin pages are read-only views).
3. **Cloudinary** — replace the gradient placeholder tiles in `/admin/gallery` and company profile
   galleries with real uploads once `CLOUDINARY_*` env vars are set.
4. **React Three Fiber hero** — swap `components/marketing/Hero`'s CSS capsule field for a real
   R3F scene; the brief treats the CSS version as an acceptable perf fallback, not a placeholder
   to necessarily replace, so this is a "nice to have."
5. **SEO/performance pass** — sitemap.xml, JSON-LD for `Product`/`Organization`, and a Lighthouse
   pass per §8 milestone 7.

## Project structure

Follows `BUILD_BRIEF.md` §4 exactly. A few notes on what's not in the brief's literal file tree
but was added because the site map requires it:

- `app/categories/page.tsx` — an index page (brief only specified `categories/[categorySlug]`)
- `app/api/register/route.ts`, `app/api/auth/[...nextauth]/route.ts` — needed for the working auth
- `lib/data/*.ts` — the mock-data layer described above
- `lib/validations/auth.ts` — Zod schemas for the register and contact forms
- `components/dashboard/`, `components/portal/` — admin and portal-specific shells not covered by
  the brief's `components/` sketch, but implied by the admin/portal page list in §4

## Known limitations of this scaffold

- Prisma's CLI (`generate`/`db push`/`validate`) could not be run during scaffolding because this
  sandbox's network policy doesn't allow reaching Prisma's engine-binary CDN. The schema and seed
  script are written carefully against the brief and cross-checked field-by-field, but treat
  `npm run db:generate` as the first command to run in a real environment, before anything else
  that touches Prisma.
- "Request Quote" buttons are currently inert (see "enquiry cart" above).
- Wishlist and inventory-alert thresholds are demo data, not yet user-editable from the admin UI.
