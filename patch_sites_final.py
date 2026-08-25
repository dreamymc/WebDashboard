import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

# Replace all align: "center" with headerAlign: "center"
content = content.replace('align: "center"', 'headerAlign: "center"')

# Remove BCF line
content = re.sub(r'\s*\{ key: "bcf", header: "BCF", cell: [^\}]+\},?', '', content)

# Reorder location columns
old_location = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province, headerAlign: "center" },
    { key: "town", header: "Town", cell: (r) => r.town, headerAlign: "center" },
    { key: "addr", header: "Address", cell: (r) => r.address, headerAlign: "center" },
    { key: "lat", header: "RTB-LAT", cell: (r) => r.lat, headerAlign: "center" },
    { key: "long", header: "RTB-LONG", cell: (r) => r.long, headerAlign: "center" },
  ];"""

new_location = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province, headerAlign: "center" },
    { key: "town", header: "Town", cell: (r) => r.town, headerAlign: "center" },
    { key: "lat", header: "RTB-LAT", cell: (r) => r.lat, headerAlign: "center" },
    { key: "long", header: "RTB-LONG", cell: (r) => r.long, headerAlign: "center" },
    { key: "addr", header: "Address", cell: (r) => r.address, headerAlign: "center" },
  ];"""

content = content.replace(old_location, new_location)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
