# Gemini / AGY Instructions

**First step**: Read `AGENTS.md` in this root directory. It contains all the vendor-neutral rules, architecture details, and hard traps for this repository. Do not skip it.

## AGY-Specific Context & Tactics

### Data Debugging Workflow
You will often need to debug data anomalies (e.g., "why are all my charts showing zero?"). 
Do not guess the data structure. The user regularly places raw Excel exports in `screenshotsForAntigravity/sheets.xlsx`. 

**The AGY Tactic**:
Before modifying `lib/google-sheets.ts` or `lib/transforms.ts`, write and execute a quick Python script using `pandas` to read `screenshotsForAntigravity/sheets.xlsx`. 

*Example that worked historically to diagnose missing headers:*
```python
import pandas as pd
df = pd.read_excel('screenshotsForAntigravity/sheets.xlsx', sheet_name='Sheet3', header=1)
print(df.columns.tolist())
```
*Note*: Headers in the live data are rarely perfectly aligned on Row 1. Using Pandas locally to inspect the raw grid helps you verify if headers have shifted rows or if numeric types (`2026.0` vs `'2026'`) are breaking TypeScript filters.

### UI Tweaks
When making UI adjustments (like modifying Tailwind classes for scorecards), you can safely run `npm run build` as a background task to verify you haven't introduced any ESLint unused variable errors or TypeScript mismatches. Next.js 15 + Turbopack builds in ~30 seconds, so it is a fast and highly recommended verification step before asking the user to push.
