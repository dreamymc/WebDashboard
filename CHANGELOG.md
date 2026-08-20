# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
* **Dynamic Header Resolution**: Implemented a dynamic row-scanning algorithm in `fetchSheetRows` to locate headers by searching for the `SERIAL NUMBER` column. This resolves application crashes caused by human operators adding metadata rows above the data table in Google Sheets.
* **Global URL Filters**: Added `Prio 1` and `Prio 2` to the global FilterBar. Integrated state preservation in `Sidebar.tsx` to append `useSearchParams()` to navigation links so filters persist across tabs.
* **New Dashboard UI**: Overhauled the Overview tab layout. Introduced the Standalone Pipeline scorecard (displaying the total dataset) alongside the Core Metrics group (displaying the Plan subset). Added `NumberReveal` animations to all KPI scorecards.
* **Context Engineering Layer**: Added `AGENTS.md`, `ARCHITECTURE.md`, `SECURITY.md`, and ADRs (`decisions/`) to onboard future developers and AI agents automatically.

### Changed
* **Data Pipeline Source Migration**: Redirected the primary data fetcher from the old dataset to `Sheet3`. Re-mapped `ACCESS VENDOR` to `VENDOR` and extracted `Filter 1` for plan determination.
* **Plan vs Pipeline Enforcement**: Refactored the math engine (`lib/transforms.ts`) to surgically isolate the current year's plan (`Filter 1 == '2026'`). All velocity, performance, and completion charts now run exclusively against `planRows`, while data tables correctly display the full `rows` pipeline.
* **Map Engine Upgrade**: Swapped default OpenStreetMap and blocked ESRI map tiles for production-safe Google Maps Hybrid tiles (`lyrs=y`). Shifted the default map center and zoom level to focus on Mindanao.
* **Month Parsing Logic**: Updated `normalizeMonth` to recognize all 12 months (including Q1/Q2) to accommodate 2027 pipeline data without breaking chart logic.

### Removed
* **Obsolete Fixtures**: Purged `tests/fixtures/data.json` and legacy Excel files from the repository to comply with strict data privacy protocols.
