import re

with open('lib/types.ts', 'r') as f:
    content = f.read()

# Add address and rtb to SiteRow
siterow_addition = """  isPlan: boolean;               // True if Filter 1 == '2026'
  address: string;
  rtb: string;
};"""
content = content.replace("  isPlan: boolean;               // True if Filter 1 == '2026'\n};", siterow_addition)

# Update SiteTableRow
old_sitetablerow = """export type SiteTableRow = {
  serialNumber: string;
  vendor: string;
  tcoVendor: string;
  province: string;
  cityTown: string;
  program: string;
  stage: string;
  lat: number | null;
  long: number | null;
};"""

new_sitetablerow = """export type SiteTableRow = {
  serialNumber: string;
  srName: string;
  plaId: string;
  bcfName: string;
  vendor: string;
  tcoVendor: string;
  program: string;
  leadIndicator: string;
  buildForecast: string;
  lat: number | null;
  long: number | null;
  province: string; // Used in search/map context if needed
  cityTown: string; // Used in search/map context if needed
};

export type LocationDirectoryRow = {
  serialNumber: string; // Hidden but good for keys
  province: string;
  town: string;
  address: string;
  rtb: string;
  lat: number | null;
  long: number | null;
};"""
content = content.replace(old_sitetablerow, new_sitetablerow)

with open('lib/types.ts', 'w') as f:
    f.write(content)
