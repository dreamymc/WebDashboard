import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

# Replace headerAlign: "center" with nothing in the locationColumns block
old_location = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province, headerAlign: "center" },
    { key: "town", header: "Town", cell: (r) => r.town, headerAlign: "center" },
    { key: "lat", header: "RTB-LAT", cell: (r) => r.lat, headerAlign: "center" },
    { key: "long", header: "RTB-LONG", cell: (r) => r.long, headerAlign: "center" },
    { key: "addr", header: "Address", cell: (r) => r.address, headerAlign: "center" },
  ];"""

new_location = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.town },
    { key: "lat", header: "RTB-LAT", cell: (r) => r.lat },
    { key: "long", header: "RTB-LONG", cell: (r) => r.long },
    { key: "addr", header: "Address", cell: (r) => r.address },
  ];"""

content = content.replace(old_location, new_location)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
