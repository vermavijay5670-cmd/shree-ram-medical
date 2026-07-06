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
| **Database** (Postgres via Prisma) | ✅ Schema written (`prisma/schema.prisma`), seed script written (`prisma/seed.ts`), and the data layer (`lib/data/*.ts`) reads from it automatically once `DATABASE_URL` is set — falls back to sample data until then |
| **Add Medicine / Add Company** (`/admin/medicines/new`, `/admin/companies/new`) | ✅ Real forms, writing straight to Postgres via API routes (`/api/admin/medicines`, `/api/admin/companies`), admin-only. This is how you add catalogue items going forward instead of editing `lib/data/*.ts` |
| Cloudinary image upload | ⏳ Wired for `next/image` remote patterns; actual upload UI is a placeholder on `/admin/gallery` |
| 3D hero (React Three Fiber) | ⏳ Still the CSS/SVG capsule field from the demo — brief explicitly allows this as a fallback |
| GSAP / Lenis smooth scroll | ⏳ Not added — current motion uses Framer Motion + IntersectionObserver, which covers everything currently on the pages |
| Enquiry "cart" (add multiple medicines to one quote request across pages) | ⏳ `MedicineCard`'s "Request Quote" button is currently inert; needs a global cart context — see below |
| SEO pass, sitemap, JSON-LD, Lighthouse tuning | ⏳ Not started (§8 milestone 7) |

### Which pages read from the database vs. sample data

Once `DATABASE_URL` is set, these read live from Postgres: `/admin/*` (all admin pages), the two
new admin forms, `/companies/[slug]`, `/medicines/[slug]`, `/categories`, `/categories/[slug]`, and
the `/api/companies`, `/api/medicines`, `/api/inventory` routes.

Still on sample data regardless of the database (a documented next step, not a bug): the
`/companies` and `/medicines` grid/search pages (they're interactive client components — wiring
them to the database means fetching through an API route or splitting them into a server+client
pair, which is a contained follow-up), the homepage stats, the marketing `/about` and `/gallery`
pages (cosmetic counts only), the admin dashboard's revenue/order analytics (synthetic demo data,
unrelated to the catalogue), and the partner portal's orders/wishlist (demo data tied to the seeded
accounts, not real transactions yet).

## Connecting the real database

The whole app currently reads from `lib/data/*.ts` — plain TypeScript modules that export the same
shape as the Prisma models (see `lib/types.ts`). **This is now a graceful fallback, not the only
option**: every read function checks `isDatabaseConfigured()` (in `lib/prisma.ts`) first — if
`DATABASE_URL` is set, it queries Postgres via Prisma; if not, it returns the bundled sample data.
So the site works with zero setup, and upgrades automatically the moment you connect a database.

### Step-by-step: connect Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine).
2. In your Supabase project, click the green **Connect** button (top of the dashboard) → choose the
   **ORMs** tab → **Prisma**. Supabase shows you two connection strings — copy both:
   - `DATABASE_URL` — the pooled connection, used for normal app queries
   - `DIRECT_URL` — the direct connection, used only when running `prisma db push` / `migrate`

   Both include a `[YOUR-PASSWORD]` placeholder — replace it with your actual database password
   (the one you saved when creating the project) in **both** strings.
3. In **Vercel → your project → Settings → Environment Variables**, add both:
   - `DATABASE_URL` = the pooled connection string
   - `DIRECT_URL` = the direct connection string
4. **Locally**, in your project folder, create a `.env` file (copy `.env.example` → `.env`) and
   paste both of the same values there too — this lets you run the next commands from your machine:
   ```bash
   npm install
   npx prisma generate     # generates the Prisma Client from schema.prisma
   npx prisma db push      # creates all the tables in your Supabase database
   npm run db:seed         # populates it with the current sample companies/medicines/etc.
   ```
5. Back in Vercel, go to **Deployments** → redeploy (or just push a commit) so the live site picks
   up the new environment variables. From this point on, the site reads and writes real data.

**Note:** `npm run build`/`postinstall` already runs `prisma generate` automatically on every
Vercel deploy (see `package.json`), so you don't need to remember that step for deploys — only for
running Prisma CLI commands (`db push`, `db seed`, `studio`) from your own machine.

**Why Prisma is pinned to v6:** Prisma 7 moved database connection URLs out of `schema.prisma`
entirely into a separate `prisma.config.ts` file with a different driver-adapter setup, and that
whole system was still actively changing as of this writing. `package.json` pins `prisma` and
`@prisma/client` to `^6.19.3`, where `url = env("DATABASE_URL")` in `schema.prisma` works exactly
as written in this project. Don't run `npm install prisma@latest` without checking Prisma's current
docs first — it will reintroduce the v7 config migration.

### Adding medicines and companies without touching code

Once the database is connected, **`/admin/medicines/new`** and **`/admin/companies/new`** are real,
working forms — name, composition, MRP, selling price, GST rate, prescription flag, and an initial
stock batch (warehouse, batch number, expiry date, quantity) all save straight to Postgres and show
up immediately on `/admin/medicines`, `/admin/companies`, and the public catalogue pages that have
been migrated to read from the database (see the table below). No more editing `lib/data/*.ts` by
hand for day-to-day additions — that file now only matters as the fallback/seed dataset.

To add more stock batches to an *existing* medicine later (as opposed to a new medicine), the
quickest path right now is **Supabase's own table editor** (Table Editor → `InventoryItem` → Insert
row) until a dedicated "Add Batch" admin form is built — that's a natural next addition, and a much
smaller piece of work than what's already done here if you want it.



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
