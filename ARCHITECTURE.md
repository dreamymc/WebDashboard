# System Architecture

This document describes the high-level system shape and design philosophies of the T7 Web Dashboard. For agent instructions and rules, see `AGENTS.md`.

## System Context
The dashboard acts as an analytical presentation layer on top of a living Google Sheet. It does not use a traditional SQL or NoSQL database. The Google Sheet acts as both the CMS and the primary database.

## Data Flow
1. **Google Sheets (The Database)**: The human operators maintain the pipeline in a specific Google Sheet (`Sheet3` for raw rows, `Sheet2` for the aggregate build plan).
2. **Next.js Server Components (The Backend)**: `app/(dashboard)/layout.tsx` is a server component that executes `fetchSheetRows()`. This function securely communicates with the Google Sheets API via a Service Account JWT, dynamically resolves the header rows, and downloads the raw dataset.
3. **React Context (The State)**: The raw data is passed into the `DataProvider` client component. 
4. **Transform Layer**: The `DataProvider` filters the data using the active URL query parameters, then passes the filtered rows through `lib/transforms.ts`. This library calculates all necessary chart metrics (KPIs, Progress, Velocity).
5. **Client Components (The UI)**: Pages consume the calculated metrics from the `DataProvider` and render them using Recharts (for graphs) and Leaflet/React-Leaflet (for maps).

## Core Design Philosophies

### 1. Zero Global State Libraries
There is no Redux, Zustand, or Jotai in this repository.
All global filtering state (e.g., active Province, active Vendor) is driven entirely by the URL query string (`useSearchParams`). 
This guarantees that:
* Users can bookmark and share specific dashboard views.
* State is preserved across page reloads.
* The state is single-source-of-truth.

### 2. Separation of Concerns (Plan vs Pipeline)
Because the database (Google Sheets) contains historical, active, and future data (2027), the transformation layer (`lib/transforms.ts`) acts as a strict firewall. 
* **Generic Data**: Passed through as the full "Pipeline".
* **Performance Metrics**: Forced through a strict `isPlan` filter (`Filter 1 == '2026'`) to prevent future pipeline data from distorting the current year's completion percentages.

### 3. Build & Render Strategy
The app uses the Next.js 15 App Router with Turbopack. The heavy lifting of downloading data from Google Sheets happens Server-Side, reducing the payload sent to the client. The client is only responsible for rendering the UI and applying local filters.
