import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

# Modify siteTable function
old_site_table = """export function siteTable(rows: SiteRow[]): SiteTableRow[] {
  return rows.map(r => ({
    serialNumber: r.serialNumber,
    vendor: r.vendor,
    tcoVendor: r.tcoBauVendor,
    province: r.province,
    cityTown: r.cityTown,
    program: r.program,
    stage: r.leadIndicator,
    lat: r.lat,
    long: r.long,
  }));
}"""

new_site_table = """export function siteTable(rows: SiteRow[]): SiteTableRow[] {
  const planRows = rows.filter(r => r.isPlan);
  return planRows.map(r => ({
    serialNumber: r.serialNumber,
    srName: r.srName,
    plaId: r.plaId,
    bcfName: r.bcfName,
    vendor: r.vendor,
    tcoVendor: r.tcoBauVendor,
    program: r.program,
    leadIndicator: r.leadIndicator,
    buildForecast: r.conservativeFC,
    lat: r.lat,
    long: r.long,
    province: r.province,
    cityTown: r.cityTown,
  }));
}"""
content = content.replace(old_site_table, new_site_table)

# Add locationDirectory function
new_func = """
export function locationDirectory(rows: SiteRow[]) {
  const planRows = rows.filter(r => r.isPlan);
  return planRows.map(r => ({
    serialNumber: r.serialNumber,
    province: r.province,
    town: r.cityTown,
    address: r.address,
    rtb: r.rtb,
    lat: r.lat,
    long: r.long,
  }));
}
"""
content = content + new_func

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
