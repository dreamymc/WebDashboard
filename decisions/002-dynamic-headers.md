# ADR 002: Dynamic Header Resolution in Google Sheets API

## Context
The dashboard pulls raw data from Google Sheets via `lib/google-sheets.ts`. In early iterations, we hardcoded the assumption that the data grid began exactly at row 2 (with row 1 being the header).

However, telecom pipeline sheets are frequently modified by human operators who add metadata rows, blank spacing rows, or merged titles above the actual data table. Hardcoding the header index caused catastrophic failures when the data was shifted down by even a single row.

## Decision
We implemented a dynamic header resolution algorithm in `fetchSheetRows()`.

When fetching the sheet, the API pulls the first 10 rows. The algorithm iterates through these rows and searches for a sentinel column name (specifically `SERIAL NUMBER` or `ACCESS VENDOR` mapped to `VENDOR`).
Once the sentinel is found, that row index is permanently locked as the `headerRowIndex` for that fetch cycle.

## Consequences
* **Resilience**: Human operators can safely add metadata or blank rows above the data table without breaking the dashboard API.
* **Sentinel Dependency**: The algorithm fundamentally relies on the existence of the `SERIAL NUMBER` column header. If the operators rename this exact column, the data fetcher will fail to locate the headers and the dashboard will crash. This is an acceptable tradeoff for vertical flexibility.
