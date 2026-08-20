import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

# 1. Update columns
old_columns = """  const siteColumns: ColumnDef<any>[] = [
    { key: "id", header: "Serial Number", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> },
    { key: "net", header: "Vendor", cell: (r) => r.vendor },
    { key: "tco", header: "TCO", cell: (r) => r.tcoVendor },
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.cityTown },
    { key: "prog", header: "Program", cell: (r) => r.program },
    { key: "stage", header: "Stage", cell: (r) => <StageBadge stage={r.stage} /> },
  ];"""

new_columns = """  const siteColumns: ColumnDef<any>[] = [
    { key: "id", header: "SERIAL NUMBER", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> },
    { key: "srName", header: "SR NAME", cell: (r) => r.srName },
    { key: "plaId", header: "PLA ID", cell: (r) => r.plaId },
    { key: "bcf", header: "BCF", cell: (r) => r.bcfName },
    { key: "net", header: "ACCESS VENDOR", cell: (r) => r.vendor },
    { key: "tco", header: "TCO", cell: (r) => r.tcoVendor },
    { key: "prog", header: "PROGRAM", cell: (r) => r.program },
    { key: "leadIndicator", header: "LEAD INDICATOR", cell: (r) => <StageBadge stage={r.leadIndicator} /> },
    { key: "fc", header: "BUILD FORECAST", cell: (r) => r.buildForecast },
  ];

  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.town },
    { key: "addr", header: "Address", cell: (r) => r.address },
    { key: "rtb", header: "RTB", cell: (r) => r.rtb },
    { key: "long", header: "LONG", cell: (r) => r.long },
    { key: "lat", header: "LAT", cell: (r) => r.lat },
  ];"""

content = content.replace(old_columns, new_columns)

# 2. Extract new fields from useData()
content = content.replace("const { siteTable, wirelessIntegration, transport } = transforms;", "const { siteTable, locationDirectory } = transforms;")

# 3. Add filteredLocation logic
content = content.replace("const filteredTR = useMemo(() => {", """const filteredLocation = useMemo(() => {
    const result = locationDirectory;
    if (selectedSiteId) return result.filter((s: any) => s.serialNumber === selectedSiteId);
    return result;
  }, [locationDirectory, selectedSiteId]);
  
  const filteredTR = useMemo(() => {""")

# 4. Remove wiColumns and trColumns
content = re.sub(r'const wiColumns: ColumnDef<any>\[\] = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const trColumns: ColumnDef<any>\[\] = \[.*?\];', '', content, flags=re.DOTALL)

# 5. Replace bottom UI section
old_bottom = """      {/* Bottom Row: Wireless Integration (6) | Transport (6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header flex justify-between">
            <span>Ongoing Wireless Integration</span>
            <span className="text-text-muted font-mono">{filteredWI.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={filteredWI} columns={wiColumns} />
          </div>
        </div>

        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header flex justify-between">
            <span>Ongoing Transport</span>
            <span className="text-text-muted font-mono">{filteredTR.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={filteredTR} columns={trColumns} />
          </div>
        </div>
      </div>"""

new_bottom = """      {/* Bottom Row: Location Directory (Full Width) */}
      <div className="panel flex flex-col">
        <div className="panel-header flex justify-between">
          <span>Site Location & RTB Directory</span>
          <span className="text-text-muted font-mono">{filteredLocation.length} rows</span>
        </div>
        <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
          <DataTable data={filteredLocation} columns={locationColumns} />
        </div>
      </div>"""

content = content.replace(old_bottom, new_bottom)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
