// ── Raw row as it comes from the Google Sheet ─────────────────────────────────
export type SiteRow = {
  serialNumber: string;          // SERIAL NUMBER
  leadIndicator: string;         // Lead Indicator (LOCAL) — e.g. "[06] S-RFI"
  vendor: string;                // VENDOR (network: Ericsson / Nokia / HT)
  srName: string;                // SR Name
  tcoBauVendor: string;          // TCO/BAU VENDOR (tower vendor)
  plaId: string;                 // PLA ID
  province: string;              // Province
  cityTown: string;              // CITY/ TOWN
  bcfName: string;               // BCF NAME
  program: string;               // PROGRAM
  plannedTech: string;           // PLANNED TECH
  lat: number | null;            // LAT — null for the one record with no coords
  long: number | null;           // LONG
  conservativeFC: string;        // CONSERVATIVE FC — month abbreviation or blank
  bndTrfsForecast: string;       // B&D TRFS Forecast — month abbreviation or blank
};

// ── Aggregated data returned by the API route ────────────────────────────────
export type KpiSummary = {
  totalPlan: number;
  q3Plan: number;
  q4Plan: number;
  q3Actual: number;
  q4Actual: number;
  trfsCount: number;
  onAirCount: number;
  rfiCount: number;
};

export type QuarterlyPlanVsActual = {
  quarter: string;  // "Q3" | "Q4"
  plan: number;
  actual: number;
  vendor: string;   // "Ericsson" | "Nokia" | "HT" | "Total"
};

export type FunnelCount = {
  stage: string;    // e.g. "[06] S-RFI"
  count: number;
  stageIndex: number; // 0-based position in STAGE_ORDER
};

export type ProgramVelocityItem = {
  program: string;
  count: number;
};

export type BuildPlanItem = {
  month: string;    // e.g. "JUL"
  count: number;
};

export type NewBuildPlanItem = {
  month: string;
  plan: number | null;
  actual: number | null;
  buildOutlook: number | null;
};

export type TechTierRow = {
  tech: string;
  plan: number;
  actual: number;
  pctTrfs: number;
};

export type RfiRallyByVendorItem = {
  stage: string;
  ericsson: number;
  nokia: number;
  ht: number;
};

export type TcoPerformanceItem = {
  vendor: string;
  rtbAndAbove: number;
  total: number;
  pctRtb: number;
};

export type TcoAwardRow = {
  tcoVendor: string;
  [stage: string]: string | number;
};

export type VendorCompletionRow = {
  vendor: string;
  total: number;
  rtbAndAbove: number;
  pctCompletion: number;
};

export type RfiDetailedRow = {
  vendor: string;
  cleanProgram: string;
  pipeline: number;
  rfti: number;
  pctRfti: number;
  trfsActual: number;
  pctTrfs: number;
  trsPending: number;
};

export type ForecastVarianceRow = {
  month: string;
  conservativeFC: number;
  bndForecast: number;
  difference: number;
};

export type ProvinceBarItem = {
  province: string;
  plan: number;
  actual: number;
};

export type TownPlanRow = {
  cityTown: string;
  province: string;
  totalPlan: number;
  totalActual: number;
  pctTrfs: number;
};

export type SiteTableRow = {
  serialNumber: string;
  vendor: string;
  tcoVendor: string;
  province: string;
  cityTown: string;
  program: string;
  stage: string;
  lat: number | null;
  long: number | null;
};

export type WirelessIntegrationRow = {
  serialNumber: string;
  vendor: string;
  province: string;
  cityTown: string;
  stage: string;
  trsActual: string;
};

export type TransportRow = {
  serialNumber: string;
  vendor: string;
  tcoVendor: string;
  province: string;
  cityTown: string;
  bndTrfsForecast: string;
};

export type DashboardData = {
  kpi: KpiSummary;
  quarterlyPlanVsActual: QuarterlyPlanVsActual[];
  funnelCounts: FunnelCount[];
  programVelocity: ProgramVelocityItem[];
  buildPlanByMonth: BuildPlanItem[];
  newBuildPlan: NewBuildPlanItem[];
  techTierPerformance: TechTierRow[];
  rfiRallyByVendor: RfiRallyByVendorItem[];
  tcoPerformance: TcoPerformanceItem[];
  tcoAwardStatus: TcoAwardRow[];
  vendorCompletion: VendorCompletionRow[];
  rfiRallyDetailed: RfiDetailedRow[];
  forecastVariance: ForecastVarianceRow[];
  provincePlanVsActual: ProvinceBarItem[];
  townPlanVsActual: TownPlanRow[];
  siteTable: SiteTableRow[];
  wirelessIntegration: WirelessIntegrationRow[];
  transport: TransportRow[];
  wirelessIntegrationCount: number;
  transportCount: number;
  fetchedAt: string;
};
