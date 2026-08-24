import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

old_cols = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.town },
    { key: "addr", header: "Address", cell: (r) => r.address },
    { key: "rtb", header: "RTB", cell: (r) => r.rtb },
    { key: "long", header: "LONG", cell: (r) => r.long },
    { key: "lat", header: "LAT", cell: (r) => r.lat },
  ];"""

new_cols = """  const locationColumns: ColumnDef<any>[] = [
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.town },
    { key: "addr", header: "Address", cell: (r) => r.address },
    { key: "lat", header: "RTB-LAT", cell: (r) => r.lat },
    { key: "long", header: "RTB-LONG", cell: (r) => r.long },
  ];"""

content = content.replace(old_cols, new_cols)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
