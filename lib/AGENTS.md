# Context for Agents: /lib

This directory is the mathematical core of the dashboard.

## File Breakdown

### `transforms.ts`
Computes all chart data structures from the raw `SiteRow[]` array. 
**CRITICAL RULE**: Do not blindly pass `rows` to chart metric functions. 
* Use `const planRows = rows.filter(r => r.isPlan)` for any function calculating velocity, performance, progress, or percentages (e.g. `programVelocity`, `tcoPerformance`). The user requires these metrics to be evaluated STRICTLY against the current year's plan (2026).
* Only use raw `rows` for generic data table components like `siteTable` where the user expects to see the full historical pipeline.

### `normalizers.ts`
Cleans raw string data from the Google Sheets API.
* `normalizeMonth`: Uses an explicit array of `['JAN', 'FEB', ...]` and `.includes()` to rip out valid months from messy strings like `[13] JAN (2027)`. Do not use strict equality or Regex word boundaries here; the `.includes()` approach is intentionally loose to catch messy operator input.
* `normalizeVendor`: Uses `.replace(/^\[\d+\]\s*/, '')` to strip bracketed numeric prefixes (e.g. `[01] ERICSSON` -> `ERICSSON`).

### `google-sheets.ts`
Server-side data fetcher. 
* The API dynamically searches the first 10 rows for headers. 
* Sheet names with spaces MUST be quoted in the range query string (e.g. `"'Sheet 3'!A1:ZZ"`).
