/**
 * Canonical stage order for the T7 dashboard.
 * Note: there is no [02]. [10] ON-AIR sits between [09] and [11].
 * The index position in this array IS the stage index used for comparisons.
 */
export const STAGE_ORDER = [
  'FOR AWARDING',
  'AWARDED / SITE HUNTING',
  'TSSR SUBMITTED',
  'TSSR APPROVED',
  'RTB',
  'CW DOING',
  'S-RFI',
  'S-RFI w/ TRS',
  'RFI',
  'RFI with TRS',
  'ON-AIR',
  'TRFS',
] as const;

export type Stage = (typeof STAGE_ORDER)[number];

/**
 * CSS variable names for each stage — used as flat data badges.
 * Keys match the stage strings exactly.
 */
export const STAGE_COLORS: Record<string, string> = {
  'FOR AWARDING':           'var(--text-muted)', // gray
  'AWARDED / SITE HUNTING': 'var(--warning)',
  'TSSR SUBMITTED':         'var(--warning)',
  'TSSR APPROVED':          'var(--warning)',
  'RTB':                    'var(--warning)',
  'CW DOING':               '#FFEA00',
  'S-RFI':                  '#FFEA00',
  'S-RFI w/ TRS':           '#FFEA00',
  'RFI':                    '#FFEA00',
  'RFI with TRS':           '#FFEA00',
  'ON-AIR':                 '#FFEA00',
  'TRFS':                   'var(--success)',
};

/** The index of the first "actual" stage (≥ S-RFI) in STAGE_ORDER */
export const ACTUAL_THRESHOLD_INDEX = STAGE_ORDER.indexOf('S-RFI');

/**
 * Returns the 0-based position of a stage in STAGE_ORDER.
 * Returns -1 if the stage is unrecognised (treat as pre-pipeline).
 */
export function stageIndex(stage: string): number {
  return STAGE_ORDER.indexOf(stage as Stage);
}

/**
 * Returns true if the stage counts as an "actual" (≥ [06]).
 * This is the §6.4 rule: includes [06] S-RFI, [07] S-RFI w/ TRS,
 * [08] RFI, [09] RFI with TRS, [10] ON-AIR, [11] TRFS.
 * DO NOT implement as a name-list match — use the index comparison.
 */
export function isActualStage(stage: string): boolean {
  const idx = stageIndex(stage);
  return idx >= ACTUAL_THRESHOLD_INDEX && idx !== -1;
}

/**
 * Normalise vendor field to consistent title case.
 * Sheet values are uppercase: "NOKIA" → "Nokia", "ERICSSON" → "Ericsson", "HT" → "HT"
 */
export function normalizeVendor(val: string): string {
  // Remove bracketed prefixes like "[01] ", "[02] ", etc.
  let v = val.trim().toUpperCase();
  v = v.replace(/^\[\d+\]\s*/, '');
  
  if (v === 'NOKIA') return 'Nokia';
  if (v === 'ERICSSON') return 'Ericsson';
  if (v === 'HT') return 'HT';
  return val.trim();
}

/** Q1 months */
export const Q1_MONTHS = new Set(['JAN', 'FEB', 'MAR']);
/** Q2 months */
export const Q2_MONTHS = new Set(['APR', 'MAY', 'JUN']);
/** Q3 months */
export const Q3_MONTHS = new Set(['JUL', 'AUG', 'SEP']);
/** Q4 months */
export const Q4_MONTHS = new Set(['OCT', 'NOV', 'DEC']);

export const ALL_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Normalise the PROGRAM field.
 * One record in the live data has "TowerCo (Macro) - btS" (lowercase s)
 * vs the canonical "TowerCo (Macro) - BTS". Without this fix the program
 * donut splits into a phantom extra slice.
 */
export function normalizeProgram(program: string): string {
  return program.trim().replace(/\bbtS\b/g, 'BTS');
}

/**
 * Parse a latitude or longitude value from the sheet.
 * Returns null if blank, zero, or unparseable.
 */
export function parseCoord(val: string | number | undefined): number | null {
  if (val == null || val === '') return null;
  const n = typeof val === 'number' ? val : parseFloat(String(val).trim());
  if (isNaN(n) || n === 0) return null;
  return n;
}

/**
 * Extract a 3-letter month abbreviation from forecast field values.
 * Sheet values look like "[07] JUL", "[10] OCT", "[00] TRFS" (done), etc.
 * Returns the 3-letter month suffix (JUL, AUG, SEP, OCT, NOV, DEC) if present.
 * Returns '' for "[00] TRFS" (completed/irrelevant) or any unrecognised value.
 */
export function normalizeMonth(val: string | undefined): string {
  if (!val) return '';
  const str = val.trim().toUpperCase();
  // Extract the last token (after the last space)
  // Special case: some formats like "JAN (2027)" have the year at the end in parens.
  // We want to grab the month name. We can just check if any month name is in the string.
  const VALID = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  for (const m of VALID) {
    if (str.includes(m)) {
      return m;
    }
  }
  
  return '';
}


export function normalizeLeadIndicator(val: string): string {
  // Remove bracketed prefixes like "[01] ", "[00] "
  return val.replace(/^\[\d+\]\s*/, '').trim();
}
