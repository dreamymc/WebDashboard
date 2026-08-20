# T7 Web Dashboard - Context for Agents

Welcome. You are dropped into a Next.js 15 (App Router) + Turbopack dashboard project for visualizing telecom rollout data. 

**Do not guess how this app works.** Read this document before touching `lib/transforms.ts` or `components/DataProvider.tsx`.

## Architecture & Data Flow
1. **Source**: Google Sheets API. We authenticate via a service account JWT.
2. **Fetch**: `lib/google-sheets.ts` fetches data server-side from `Sheet3` (the primary pipeline sheet) and `Sheet2` (build plan).
3. **State**: Data is passed from Server Components (`layout.tsx`) to `components/DataProvider.tsx` (Client Component). `DataProvider` intercepts the data, filters it using URL query parameters (`useSearchParams`), computes all chart metrics via `lib/transforms.ts`, and broadcasts the state down the tree.
4. **UI**: Tailwind CSS + Lucide React + Recharts. 

## Commands (Tested & Verified)
* **Dev Server**: `npm run dev`
* **Production Build**: `npm run build` (Run this frequently to check for ESLint unused variable errors and TS type check failures; Turbopack builds fast).

## Environment Variables
Requires a `.env.local` containing:
* `GOOGLE_SHEET_ID`: The ID of the target spreadsheet.
* `GOOGLE_SERVICE_ACCOUNT_JSON`: Full JSON string of the service account credentials.

## Hard Rules & Conventions

### 1. The "Plan" vs "Pipeline" Distinction (CRITICAL)
This is the easiest place to break the app. 
* **Pipeline**: The entire valid dataset from Sheet3 (all rows with a valid Serial Number). Currently ~614 rows.
* **Plan**: The strict subset of the Pipeline belonging to the active year (2026). Identified by `String(Filter 1).trim() === '2026'`.
* **Application**: In `lib/transforms.ts`, chart logic tracking progress or performance (e.g., `quarterlyPlanVsActual`, `vendorCompletion`, `techTierPerformance`, `programVelocity`, `rfiRallyByVendor`) MUST filter their computations to `planRows = rows.filter(r => r.isPlan)`. 
* **Scorecards**: The Overview page has two distinct scorecards. The top-left standalone scorecard is the total **Pipeline** (`kpi.totalPipeline`). The nested scorecard is the **Plan** (`kpi.totalPlan`).

### 2. Persistent Navigation Filters
Filters (`province`, `program`, `vendor`, `prio1`, `prio2`) are driven exclusively by the URL query string. 
To ensure filters "follow" the user when switching tabs, `components/layout/Sidebar.tsx` dynamically appends the current `useSearchParams()` to every `<Link>` `href`. 
* **Rule**: If you add new navigation links or programmatic routing, you MUST carry over the current search params.

## Known Traps from Session History

### Google Sheets API Traps
* **Dynamic Header Rows**: Do not hardcode the assumption that headers are on Row 1 or Row 2. `fetchSheetRows` scans the first 10 rows for the string `SERIAL NUMBER` to dynamically anchor the header index.
* **Trailing Spaces in Sheet Names**: The Google Sheets API crashes if you request a range without quoting a sheet name that contains spaces. Always use single quotes: `range: "'${targetSheet}'!A1:ZZ"`.
* **String/Number Ambiguity**: The API often returns numerical values (like `2026`) as `2026` or `2026.0`. When checking cell values against strings, *always* cast them: `String(cellValue).trim() === '2026'`.
* **Bracketed Prefixes**: Vendor columns often contain values like `[01] ERICSSON`. `normalizeVendor` in `lib/normalizers.ts` uses Regex to strip these bracket prefixes before mapping them to internal canonical names (`Ericsson`).

### Recharts & Month Normalization
* **Empty Quarters**: The Quarterly Plan vs Actual chart has no data for Q1 and Q2 because there are zero 2026 sites assigned to those quarters. Do not attempt to force 2027 data into these columns; they are naturally 0.
* **Month Strings**: Forecast months arrive in formats like `[13] JAN (2027)`. `normalizeMonth` iterates over an array of valid 3-letter months and uses `.includes()` to safely extract the month name.

### Map Tiles (Vercel Blocking)
* **ESRI Maps**: The user's production Vercel deployment blocks ESRI map tile domains. Do not attempt to use `server.arcgisonline.com` for the Leaflet maps. 
* **Google Maps**: We strictly use Google Maps Hybrid tiles (`mt1.google.com/vt/lyrs=y`) for the Leaflet map because it works in production without being blocked.
