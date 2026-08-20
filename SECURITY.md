# Security Policy

The T7 Web Dashboard handles internal telecom rollout data. Maintaining strict security protocols is essential to prevent data leaks and unauthorized access.

## Data Privacy & Source Control
* **No PII or Live Data in the Repo**: Under no circumstances should live data files (`.xlsx`, `.csv`, `.json`), database exports, or fixtures containing genuine site locations or serial numbers be committed to this repository.
* **Scratch Directories**: The `.gitignore` is configured to block directories like `screenshotsForAntigravity/` and `scratch/`. These are used for local debugging and must never be pushed to version control.
* **Agent Enforcement**: AI Agents operating in this repository are strictly instructed to respect the `.gitignore` and never embed live data in logs or code comments.

## Authentication & Authorization
* **Dashboard Access**: The application routes (e.g., `/overview`, `/pipeline`, `/sites`) are protected by a Next.js `middleware.ts` layer. 
* **Rate Limiting**: The middleware implements an Edge-compatible in-memory rate limiter to mitigate brute force login attempts against the `/api/auth/login` route.
* **Google Sheets API**: The server securely connects to the Google Sheets API using a Google Service Account JWT. The credentials (`GOOGLE_SERVICE_ACCOUNT_JSON`) are stored securely in Vercel Environment Variables and `.env.local`. They are never exposed to the client bundle.

## Network & Third-Party Egress
* **Map Providers**: To comply with Vercel deployment egress rules and organizational firewalls, we exclusively use whitelisted map tile providers (e.g., Google Maps Hybrid: `mt1.google.com`). We explicitly block ESRI map tiles (`server.arcgisonline.com`) due to known Vercel blocking issues in production.

## Reporting a Vulnerability
If you discover a security vulnerability, please do not file a public issue. Escalate it directly to the repository owners.
