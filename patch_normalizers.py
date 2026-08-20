import re

with open('lib/normalizers.ts', 'r') as f:
    content = f.read()

# Replace STAGE_ORDER and STAGE_COLORS
old_stages = """export const STAGE_ORDER = [
  '[01] AWARDED / SITE HUNTING',
  '[03] TSSR APPROVED',
  '[04] RTB',
  '[05] CW DOING',
  '[06] S-RFI',
  '[07] S-RFI w/ TRS',
  '[08] RFI',
  '[09] RFI with TRS',
  '[10] ON-AIR',
  '[11] TRFS',
] as const;

export type Stage = (typeof STAGE_ORDER)[number];

/**
 * CSS variable names for each stage — used as flat data badges.
 * Keys match the stage strings exactly.
 */
export const STAGE_COLORS: Record<string, string> = {
  '[01] AWARDED / SITE HUNTING': 'var(--warning)',
  '[03] TSSR APPROVED':          'var(--warning)',
  '[04] RTB':                    'var(--warning)',
  '[05] CW DOING':               '#FFEA00',
  '[06] S-RFI':                  '#FFEA00',
  '[07] S-RFI w/ TRS':           '#FFEA00',
  '[08] RFI':                    '#FFEA00',
  '[09] RFI with TRS':           '#FFEA00',
  '[10] ON-AIR':                 '#FFEA00',
  '[11] TRFS':                   'var(--success)',
};

/** The index of the first "actual" stage (≥ [06]) in STAGE_ORDER */
export const ACTUAL_THRESHOLD_INDEX = STAGE_ORDER.indexOf('[06] S-RFI'); // = 4"""

new_stages = """export const STAGE_ORDER = [
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
export const ACTUAL_THRESHOLD_INDEX = STAGE_ORDER.indexOf('S-RFI');"""

content = content.replace(old_stages, new_stages)

# Add normalizeLeadIndicator
new_func = """
export function normalizeLeadIndicator(val: string): string {
  // Remove bracketed prefixes like "[01] ", "[00] "
  return val.replace(/^\[\d+\]\s*/, '').trim();
}
"""
content = content + new_func

with open('lib/normalizers.ts', 'w') as f:
    f.write(content)
