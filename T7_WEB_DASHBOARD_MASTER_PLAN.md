# T7 Web Dashboard — Master Plan v2.0

> **Status:** APPROVED — ready for execution. Google Sheets credentials and session secret already provisioned in `.env.local`; see §12.
> **Target Directory:** `/home/visionmc/projects/WebDashboard`
> **Data Source:** Google Sheet (single tab, 262 records) — same sheet previously used by the deprecated Python desktop build.

---

## Changelog from v1.0

| Change | Reason |
|---|---|
| Added full auth layer (Phase 1) | Public no-login deployment was unacceptable for internal Globe operational data |
| Removed Globe Telecom logo and brand blue | Unofficial tool must not present as an official Globe property |
| Removed Python→TypeScript port framing | Python desktop project is deprecated; this is a greenfield build, not a port |
| Business rules written out explicitly (§6) | Rules must not be re-derived by hand; the stage-index rule in particular is a known trap |
| Sharpened design differentiation (§4.5) | v1's stack + "hard borders, dark, flat" is itself becoming a default look |
| Map demoted from central anchor | User decision: standard corporate dashboard, no single dominant visual metaphor |
| Filter state moved to URL params | Enables sharing a filtered view via link |

---

## 1. Project Overview

A web dashboard for T7 telecommunications site rollout tracking, deployed on Vercel, reading from a Google Sheet. Access is password-gated. Audience is corporate decision-makers aged 30–50 at Globe Telecom, reached exclusively via links distributed by the project supervisor.

**This is an unofficial internal tool.** It carries no Globe Telecom branding, logos, or brand colors. It should read as a competent engineering utility, not as an official corporate product.

---

## 2. Access Control & Sharing (Phase 1 — build before any data is exposed)

### 2.1 Two-Tier Access Model

| Tier | Who | Credential | Can do |
|---|---|---|---|
| **Admin** | Sir Chester (supervisor) | Master password (env var) | View dashboard + access `/admin` to create, list, and revoke share links |
| **Viewer** | Anyone Chester shares a link with | Per-link password | View dashboard only. No admin access. |

The master password is the admin login. There is no separate account system, no usernames, no signup. One password unlocks admin; scoped per-link passwords unlock view-only access.

### 2.2 Why native Vercel protection is NOT used

Verified against Vercel's current documentation:

- **Password Protection** (a real gate on the production domain) requires an Enterprise plan, or a **$150/month** Advanced Deployment Protection add-on on Pro. Not available on Hobby.
- **Vercel Authentication** (free on Hobby) only protects preview/deployment URLs — the production domain stays public. It also only recognises users already signed into a Vercel account, which Globe staff will not have.

Therefore auth is implemented in application code via Next.js middleware. This is the standard, documented approach for this exact gap and works on the free tier.

### 2.3 Storage: Vercel KV

Share links need real persistence (creation, revocation, expiry, usage counts). A hardcoded list cannot support a self-service admin page.

- **Vercel KV** (first-party, Redis-compatible, free tier sufficient for this scale).
- Key pattern: `share:{token}` → `{ passwordHash, label, createdAt, expiresAt, maxUses, useCount, revoked }`.
- Session cookies are signed JWTs (`jose` library, edge-compatible), not KV lookups on every request.

### 2.4 Auth Flow

```
Visitor hits any /(dashboard) route
  → middleware checks for valid session cookie
     → valid: allow through
     → invalid/absent: redirect to /login
        → /login accepts EITHER the master password OR a valid share-link password
           → master password  → session cookie with role=admin
           → share password   → session cookie with role=viewer, bound to that token
```

- Share links are of the form `/login?t={token}`, which pre-fills which link is being used; the recipient still enters the password Chester gives them.
- Middleware protects `/(dashboard)/*`, `/admin/*`, and `/api/data`. Only `/login` and static assets are open.
- `/admin/*` additionally requires `role=admin`.

### 2.5 Admin Page (`/admin`)

Chester can:
- Create a share link: enter a label (e.g. "Regional Heads"), a password, optional expiry date, optional max-use count. Receives a copyable URL.
- New links default to a **30-day expiry** unless Chester overrides it at creation (sets a different date, or clears it for never-expiring).
- View all links in a table: label, created date, expiry, uses/max, status.
- Revoke any link instantly (sets `revoked: true`; middleware rejects on next request).

### 2.6 Security Requirements (non-negotiable)

- Passwords stored **hashed only** (bcrypt or PBKDF2-SHA256). Never plaintext in KV, logs, or the admin UI. Once created, a password cannot be re-displayed, only reset.
- Password comparison must be **timing-safe**.
- Rate-limit `/login` (e.g. 5 attempts per IP per minute) to prevent brute-forcing.
- `robots.txt` disallows all; `X-Robots-Tag: noindex` header on every response.
- Google service account credentials are server-only, never sent to the browser.
- Session cookies: `httpOnly`, `secure`, `sameSite=lax`, reasonable expiry (e.g. 7 days).

---

## 3. Tech Stack (Locked)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Vercel-native; server components keep Sheets credentials server-side |
| Language | TypeScript (strict) | Data-heavy app; catch shape errors at build |
| Styling | Tailwind CSS v4 | 8pt grid enforced in config |
| Components | shadcn/ui | Radix primitives, accessible, no lock-in |
| Charts | Recharts | Standard for React dashboards, composable |
| Map | react-leaflet + Leaflet | No API key needed; data already has lat/long |
| Auth | Next.js middleware + `jose` (JWT) | Free-tier viable; see §2.2 |
| Storage | Vercel KV | Share link persistence |
| Hashing | `bcryptjs` or Web Crypto PBKDF2 | Edge-runtime compatible |
| Theme | next-themes | OS detection + localStorage |
| Icons | lucide-react | shadcn's standard partner |
| Font | Inter or IBM Plex Sans (see §4.5) | Deliberately not Geist |
| Data | Server Components + ISR (60s) | Credentials never exposed |

---

## 4. Design System

### 4.1 Anti-Slop Mandate

- Zero glassmorphism, zero gradient meshes, zero soft drop-shadows.
- Hard `1px solid var(--border)` only. No `box-shadow: 0 4px 6px rgba(...)`.
- Accent colors are functional data indicators, never decoration.
- All spacing is a multiple of 8px.
- Type scale: `12 / 14 / 16 / 20 / 24 / 32 / 48px`. No arbitrary sizes.
- Every color/font references `var(--token)`. Zero inline hex in components.

### 4.2 Color Tokens (`globals.css`)

```css
:root[data-theme="dark"] {
  --bg:            #0a0a0a;
  --surface:       #111111;
  --surface-hover: #1a1a1a;
  --border:        #262626;
  --text-primary:  #fafafa;
  --text-secondary:#a3a3a3;
  --text-muted:    #525252;

  /* Pipeline stage colors — flat, functional, NO gradients */
  --stage-01: #6b7280;   /* [01] AWARDED / SITE HUNTING */
  --stage-03: #8b5cf6;   /* [03] TSSR APPROVED */
  --stage-04: #a78bfa;   /* [04] RTB */
  --stage-05: #f59e0b;   /* [05] CW DOING */
  --stage-06: #fb923c;   /* [06] S-RFI */
  --stage-07: #38bdf8;   /* [07] S-RFI w/ TRS */
  --stage-08: #60a5fa;   /* [08] RFI */
  --stage-09: #818cf8;   /* [09] RFI with TRS */
  --stage-10: #c084fc;   /* [10] ON-AIR */
  --stage-11: #34d399;   /* [11] TRFS */

  --success: #34d399;
  --warning: #f59e0b;
  --danger:  #ef4444;
  --info:    #38bdf8;

  --accent:  #38bdf8;  /* interactive elements — NOT a corporate brand color */
}

:root[data-theme="light"] {
  --bg:            #f5f5f5;
  --surface:       #ffffff;
  --surface-hover: #f9f9f9;
  --border:        #e5e5e5;
  --text-primary:  #0a0a0a;
  --text-secondary:#525252;
  --text-muted:    #a3a3a3;
  /* Stage colors identical in both themes — they are data, not decoration */
}
```

### 4.3 Typography

| Usage | Size | Weight |
|---|---|---|
| Page title | 24px | 700 |
| Card/section header | 16px | 600 |
| KPI value | 32px | 700 |
| KPI label | 12px | 500 |
| Table header | 12px | 600 |
| Table body | 14px | 400 |
| Sidebar nav | 14px | 500 (active: 600) |

Line height `1.5` body, `1.2` headings. Weight creates hierarchy, not multiple typefaces.

### 4.4 Spacing

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px` only.

Data-dense panels (tables, KPI rows) must use **tighter padding than shadcn defaults**. Shadcn's default card padding is calibrated for marketing layouts. More visible rows without scrolling reads as a working tool rather than a screenshot.

### 4.5 Differentiation

The v1 combination (shadcn + Tailwind + Recharts + near-black surfaces + hard borders + Geist) has become the default output of AI coding agents told to "build a clean dashboard." Avoiding 2023-era slop tells is not the same as being differentiated. Three concrete levers:

1. **Tabular numerals everywhere.** `font-variant-numeric: tabular-nums` on all KPI values and numeric table columns. Digits align in columns instead of jittering by width. This is the single clearest tell of a tool built for operational reading.
2. **Stage colors as a cross-cutting visual language.** The 10-stage palette is the strongest idea in this design. Use it not only in charts but as small flat badge/chip indicators in every table row showing a stage. By page three the user should read stage by color without consulting a legend.
3. **Font: not Geist.** Geist is Vercel's own font and the path of least resistance for anything deployed there. Use **Inter** (neutral, excellent tabular figures) or **IBM Plex Sans** (slightly more engineered character, strong technical heritage). Either reads less templated here.

**Differentiation anchor:** "If screenshotted, this reads as a rollout tracker built by someone who has to use it daily — dense, stage-color-fluent, numerically precise. Not a dashboard built to be demoed."

### 4.6 Skills

Before implementing the design system (Phase 3) and during the final audit (Phase 10), Antigravity should check the global skills directory for `frontend-design`, `hallmark`, `theme-factory`, and `rayden-code`, and apply whatever is relevant. These skills are local to the development machine; their contents have not been reviewed in this plan, so Antigravity must read them directly rather than assume their contents.

---

## 5. Architecture

```
WebDashboard/
├── middleware.ts               # Auth gate — protects all dashboard/admin/api routes
├── app/
│   ├── layout.tsx              # Root: ThemeProvider, font, providers
│   ├── globals.css             # All CSS variable tokens, Tailwind base
│   ├── page.tsx                # Redirect → /overview
│   ├── login/page.tsx          # Password entry (master OR share-link)
│   ├── admin/
│   │   └── page.tsx            # Share link management (role=admin only)
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + TopBar shell
│   │   ├── overview/page.tsx
│   │   ├── pipeline/page.tsx
│   │   ├── vendors-tco/page.tsx
│   │   ├── forecast/page.tsx
│   │   └── sites/page.tsx
│   └── api/
│       ├── data/route.ts       # Sheet fetch + transforms → JSON (auth required)
│       └── admin/
│           └── links/route.ts  # CRUD for share links (admin only)
├── components/
│   ├── layout/{Sidebar,SidebarNavLink,TopBar,FilterBar}.tsx
│   ├── ui/                     # shadcn generated
│   ├── charts/{KpiCard,StageBarChart,FunnelBarChart,DonutChart,ProvinceBarChart,SiteMap}.tsx
│   └── tables/{DataTable,PaginatedTable,StageBadge}.tsx
├── lib/
│   ├── auth.ts                 # JWT sign/verify, password hash/compare
│   ├── share-links.ts          # KV operations for share links
│   ├── google-sheets.ts        # Server-only Sheet fetch
│   ├── transforms.ts           # All aggregation logic (see §6)
│   ├── normalizers.ts          # Stage order, color mapping, data cleaning
│   └── types.ts                # SiteRow, DashboardData, ShareLink
├── .env.local
└── {next,tailwind,tsconfig,package}.*
```

---

## 6. Data Layer & Business Rules

### 6.1 Source Data

Single Google Sheet tab. Headers on **row 2**, data from row 3. 262 valid records (filter on non-null `SERIAL NUMBER` — the raw export contains blank padding rows).

Columns: `SERIAL NUMBER`, `Lead Indicator (LOCAL)`, `VENDOR`, `SR Name`, `TCO/BAU VENDOR`, `PLA ID`, `Province`, `CITY/ TOWN`, `BCF NAME`, `PROGRAM`, `PLANNED TECH`, `LAT`, `LONG`, `CONSERVATIVE FC`, `B&D TRFS Forecast`.

### 6.2 Critical Field Distinctions

- **`VENDOR`** (Ericsson 132 / Nokia 83 / HT 47) is the *network equipment* vendor.
- **`TCO/BAU VENDOR`** (Frontier, Philtower, Unity, HT, LDIC, Nokia, Ison, Edotco, Alt Global) is the *tower/site* vendor.
- These are different fields feeding different panels. Do not conflate them.

### 6.3 Canonical Stage Order

```
[01] AWARDED / SITE HUNTING
[03] TSSR APPROVED
[04] RTB
[05] CW DOING
[06] S-RFI
[07] S-RFI w/ TRS
[08] RFI
[09] RFI with TRS
[10] ON-AIR
[11] TRFS
```

Note `[10] ON-AIR` sits between `[09]` and `[11]`, not at the end. There is no `[02]`.

### 6.4 Verified Business Rules

All values below were verified directly against the 262-record dataset and reproduce the source dashboard exactly.

| Metric | Rule | Expected |
|---|---|---|
| Total Plan / Pipeline | Total row count | 262 |
| Q3 Plan | `B&D TRFS Forecast` ∈ {JUL, AUG, SEP} | 81 |
| Q4 Plan | `B&D TRFS Forecast` ∈ {OCT, NOV, DEC} | 72 |
| Q3 Actual | Q3 month **AND** stage index ≥ `[06]` | 62 |
| Q4 Actual | Q4 month **AND** stage index ≥ `[06]` | 9 |
| TRFS count | stage == `[11] TRFS` | 109 |

> **⚠ KNOWN TRAP — Quarterly Actuals.** "Stage index ≥ `[06]`" means **all six** of `[06] S-RFI`, `[07] S-RFI w/ TRS`, `[08] RFI`, `[09] RFI with TRS`, `[10] ON-AIR`, `[11] TRFS`.
> Implementing this as a literal match on the four names "S-RFI, RFI, TRFS, ON-AIR" silently excludes `[07] S-RFI w/ TRS` and `[09] RFI with TRS`, producing **45** for Q3 instead of 62. Use an ordered stage index comparison, never a name list.

Per-vendor Q3/Q4 breakdown (verified — use as test fixtures):

| Vendor | Q3 Plan | Q3 Actual | Q4 Plan | Q4 Actual |
|---|---|---|---|---|
| Ericsson | 60 | 43 | 52 | 4 |
| Nokia | 7 | 7 | 6 | 4 |
| HT | 14 | 12 | 14 | 1 |

Forecast Variance (verified):

| Month | Conservative FC | B&D Forecast |
|---|---|---|
| JUL | 14 | 15 |
| AUG | 41 | 44 |
| SEP | 14 | 22 |
| OCT | 33 | 23 |
| NOV | 34 | 32 |
| DEC | 17 | 17 |

### 6.5 Data Cleaning (required in `normalizers.ts`)

- Filter rows where `SERIAL NUMBER` is null.
- Normalize `PROGRAM` case: one record contains `TowerCo (Macro) - btS` against `TowerCo (Macro) - BTS` elsewhere. Without normalizing, the program donut splits into a phantom extra slice.
- One record has null `LAT`/`LONG` — exclude from map, keep in all other aggregations. Do not drop the row.

### 6.6 Unresolved Filters (do not guess)

- **Ongoing Wireless Integration table:** target size is **17 rows** (from the source dashboard's pagination footer). Stage `[07]`–`[09]` yields 43 — wrong. Stage `[09]`/`[10]` yields 10 — wrong. Test candidate conditions against the known count of 17 before finalizing. The `TRS Actual` column displays month codes, suggesting the filter involves a forecast-month field rather than stage alone.
- **Ongoing Transport table:** true row count unknown. The "262" figure near this table in the source PDF is almost certainly a layout artifact (identical to total pipeline count), not a real target. Build the filter (likely: non-`[00] TRFS` `B&D TRFS Forecast`) and report the resulting count rather than matching a number.

### 6.7 Transform Functions (`lib/transforms.ts`)

Pure functions, no side effects, no fetching.

`kpiSummary`, `quarterlyPlanVsActual`, `funnelCounts`, `programVelocity`, `buildPlanByMonth`, `techTierPerformance`, `rfiRallyByVendor`, `tcoPerformance`, `tcoAwardStatus`, `vendorCompletion`, `rfiRallyDetailed`, `forecastVariance`, `provincePlanVsActual`, `townPlanVsActual`

### 6.8 Caching

- `export const revalidate = 60` on the data route (ISR).
- Refresh button calls the API with `cache: 'no-store'` to force a fresh pull.
- `Last refreshed: X min ago` shown in TopBar.

---

## 7. Layout & Navigation

### 7.1 Sidebar (desktop, fixed left, 240px)

```
┌──────────────────────┐
│ T7 Dashboard         │  ← wordmark only, no logo
│ ─────────────────    │
│ ▌Overview            │  ← active: 2px left border (--accent)
│   Pipeline           │
│   Vendors & TCO      │
│   Forecast           │
│   Sites              │
│ ─────────────────    │
│ Admin  (admin only)  │
│ [Light / Dark]       │
└──────────────────────┘
```

Text-only nav, no icons. Hover: `--surface-hover`, instant, no transition delay. The Admin link renders only for `role=admin` sessions.

### 7.2 Mobile

Below `lg`: sidebar hidden, hamburger opens a shadcn `Sheet` with the same nav. Closes on selection. `200ms ease`.

### 7.3 TopBar

```
[Page Title]        [🕐 08:41:05]  [Refreshed 3 min ago]  [Refresh]  [Log out]
```

### 7.4 Filter Bar

```
[Province ▼]  [Program ▼]  [Vendor (Network) ▼]  [Clear Filters]
```

- Client-side via `useMemo` over all 262 rows (correctly sized at this volume — do not build server-side filtering).
- **Filter state lives in URL search params**, not component state. This makes a filtered view shareable as a link and survives navigation.

---

## 8. Page Layouts

Grid with `gap-6` (24px). Deliberate uneven spans, not always-equal halves.

**Overview:** KPI ×8 (4 cols desktop / 2 tablet / 1 mobile) → Quarterly bar chart (7) | Quarterly table (5)

**Pipeline:** Funnel bar (7) | Program donut (5) → Build plan bar (6) | Tech tier table (6)

**Vendors & TCO:** RFI rally stacked bar (6) | TCO performance bar (6) → TCO award table (5) | Vendor completion table (7) → RFI rally detailed (full)

**Forecast:** Forecast variance table (5) | Province bar (7) → Town plan vs actual (full, paginated 15/page)

**Sites:** Site map (9) | Stage legend (3) → Site table (full) → Wireless integration (6) | Transport (6)

Clicking a map marker filters the site table to that site.

---

## 9. Responsive

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Sidebar hidden, hamburger. All panels 1 col. |
| `768–1024px` | Sidebar hidden, hamburger. KPI 2 cols, charts 1 col. |
| `≥ 1024px` | Fixed sidebar, multi-column grid. |

---

## 10. Execution Phases

| Phase | Work | Done when |
|---|---|---|
| **0** | Bootstrap: Next.js 15, TS strict, Tailwind v4, shadcn/ui, deps, repo, env scaffolding | `npm run dev` serves a blank styled page |
| **1** | **Auth layer:** middleware, `/login`, JWT sessions, KV share-link store, `/admin` page, rate limiting, noindex | Cannot reach any dashboard route without a password; Chester can create/revoke links |
| **2** | Data layer: Sheets client, types, normalizers, transforms, API route, unit tests | Tests green incl. Q3 Actual == 62, Q4 Actual == 9 |
| **3** | Design system: tokens, font, tabular numerals, shadcn theming, density overrides. Apply local design skills (§4.6) | Tokens render in both themes; no inline hex anywhere |
| **4** | Shell: sidebar, TopBar, dashboard layout, URL-param filter bar | Nav routes correctly; filters persist in URL |
| **5** | Shared components: KpiCard, DataTable, StageBadge, chart wrappers, SiteMap | Components render against fixture data |
| **6** | Overview page | Matches §8, KPIs correct |
| **7** | Pipeline page | Funnel + donut + build plan + tech tier correct |
| **8** | Vendors & TCO page | Vendor table matches §6.4 fixtures exactly |
| **9** | Forecast + Sites pages | Forecast variance matches §6.4; map plots 261 sites |
| **10** | Audit: Hallmark critique, responsive check, Lighthouse, **auth penetration check** | All pages ≥3/5 on P/H/E/S/R/V; no route reachable unauthenticated |

**Phase 1 must complete before Phase 2.** No route that returns real data should exist before the gate that protects it.

---

## 11. Testing Requirements

`lib/transforms.test.ts` must assert, against a frozen fixture (a committed snapshot of the sheet export, never a live fetch):

```
totalPlan === 262
q3Plan === 81       q4Plan === 72
q3Actual === 62     q4Actual === 9      ← catches the §6.4 stage-index trap
trfsCount === 109
ericssonQ3Actual === 43
augConservativeFC === 41    augBndForecast === 44
```

Tests must be deterministic — they validate transform logic, not current live data.

---

## 12. Environment Variables

```bash
# .env.local (never committed) / Vercel Project Settings
GOOGLE_SERVICE_ACCOUNT_JSON='{ "type": "service_account", ... }'   # ✅ already populated — migrated from the deprecated Python project's credentials
GOOGLE_SHEET_ID=                                                    # ✅ already populated — same sheet as the deprecated Python project

ADMIN_PASSWORD_HASH=        # ⏳ pending — bcrypt hash of Chester's master password; needs bcryptjs (installed in Phase 0), ask the user for the password before generating
SESSION_SECRET=             # ✅ already populated — random string generated for JWT signing

KV_REST_API_URL=            # ⏳ pending — auto-populated once Vercel KV is attached to the project
KV_REST_API_TOKEN=          # ⏳ pending — auto-populated once Vercel KV is attached to the project
```

---

## 13. Resolved Decisions

1. **Session length:** 7 days.
2. **Share link defaults:** new links default to a 30-day expiry unless Chester overrides it at creation (see §2.5).
3. **Chester's onboarding:** no separate written guide — the `/admin` page UI is self-evident.

---

*Single source of truth for the T7 Web Dashboard. Changes require explicit approval before code is written.*