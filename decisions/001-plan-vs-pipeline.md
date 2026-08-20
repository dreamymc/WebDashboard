# ADR 001: The "Plan" vs "Pipeline" Distinction

## Context
The primary data source (Google Sheets) contains a raw pipeline of telecom rollout sites. As the rollout progresses over multiple years, the raw sheet accumulates historical data, current active data, returned sites, and future projections (e.g., 2027 sites).

We needed a way to calculate accurate performance metrics (KPIs, Completion Percentages, Funnel Counts) for the *current active year* without being skewed by future pipelines or irrelevant stages.

## Decision
We enforce a strict separation between **Pipeline** and **Plan** at the transformation layer (`lib/transforms.ts`):

1. **Pipeline (`rows`)**: The entire dataset (excluding rows without a valid Serial Number). This represents all historical, current, and future data.
2. **Plan (`planRows`)**: A heavily filtered subset of the Pipeline, representing the active goal for the current year (2026).

**How "Plan" is identified**:
Instead of hardcoding a list of valid stages to include/exclude (which proved fragile as stages like `[12] Returned` and `[14] w/ ISSUES` were added), we use the `Filter 1` column. 
A site is considered part of the Plan **only if** `Filter 1 == '2026'`.

## Consequences
* **UI Segregation**: The UI explicitly differentiates between the two. The main "Pipeline" scorecard shows the total row count (e.g., 614). The "Plan" scorecard shows the 2026 subset (e.g., 264).
* **Chart Logic Requirement**: Any chart that visualizes performance, velocity, or completion (e.g., `quarterlyPlanVsActual`, `programVelocity`, `vendorCompletion`) MUST filter its input to `planRows`. If a developer accidentally passes `rows` to these functions, the charts will calculate completion percentages against the total pipeline (including 2027 sites), resulting in massively skewed and deflated percentages.
* **Data Table Exception**: Raw data tables (like `siteTable`) intentionally receive the full `rows` pipeline so users can manually search and filter across all historical and future sites.
